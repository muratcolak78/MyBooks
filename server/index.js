import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const FLASK_API = process.env.FLASK_API;
const DATABASE=process.env.DATABASE;



import express from 'express';
import axios from 'axios';
import cors from "cors";
import sqlite3 from "sqlite3";
import { hashPassword } from './Auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// connect with database

const db = new sqlite3.Database(DATABASE,(err)=>{
    if(err){
        console.log("There is no connection ")
    }else{
        console.log("Connected !!")
        initializeTables();
    }

});

function initializeTables(){
    // Table: roles
    db.run(`
            CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
            )   
        
    `);

    // Table: users
      db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role_id INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active INTEGER DEFAULT 1,
            FOREIGN KEY (role_id) REFERENCES roles(id)
            )   
        
        `);
        db.run(
            `
            CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT UNIQUE,
            published_year INTEGER,
            cover_path TEXT,
            description TEXT,
            category INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `
        );
        db.run(
            `
            CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            
            `
        );
}


// KI_ Get analyse from flask api.
app.post('/api/comments/analyze', async (req, res) => {
  const { text } = req.body;
    console.log(text)
  try {
    const flaskResponse = await axios.post(FLASK_API, { text });
    const sentiment = flaskResponse.data[0].label;
    const score = flaskResponse.data[0].score;

    res.json({ sentiment, score });
  } catch (error) {
    console.error('Flask API hatası:', error.message);
    res.status(500).json({ error: 'ML servisine bağlanılamadı' });
  }
});

// Add user

app.post('/api/users/adduser/',async (req,res)=>{
    const { name, surname, email, password } = req.body;
    try {
        const passwordHashed=await hashPassword(password)
        const sql="insert into users (name, surname,email,password) values(?,?,?,?)";

        db.run(sql, [name, surname, email, passwordHashed],(err)=>{
            if(err){
                return res.status(500).json({error:"Error adding user"});
            }else{
                return res.status(200).json({message:"User successfully added"});
            }
        });
        
    } catch (error) {

        return res.status(500).json({ error: "Hashing failed" });
    }
   

})

app.get('/api/books/getallbooks', async (req, res)=>{
    try {
        db.all('select * from books',[],(err, rows)=>{
        if(err) return res.status(500).json({error:"there is no data"});
        else return res.status(200).json({books:rows});
    });
    } catch (error) {
         return res.status(500).json({ error: "Getting books failed" });    }
   
});

app.get('/api/books/getbyid/:id', async (req, res) => {
    const id = req.params.id;
    try {
        db.all(
            `SELECT 
                b.title, 
                b.author, 
                b.isbn, 
                b.published_year, 
                b.cover_path, 
                b.description,
                c.name as category_name 
             FROM books b 
             JOIN categories c ON c.id = b.category 
             WHERE b.id = ?`, 
            [id], 
            (err, rows) => {
                if(err) {
                    console.error("Database error:", err);
                    return res.status(500).json({error: "Database error"});
                }
                if(rows.length === 0) return res.status(404).json({error: "Book not found"});
                return res.status(200).json({book: rows[0]});
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Getting book failed" });
    }
});

//api/books/getsamebooks

app.get('/api/books/getsamebooks/:category', async (req, res) => {
    const category = req.params.category;
    const excludeId = req.query.exclude || 0; // Hariç tutulacak kitap ID'si
    
    try {
        db.all(
            `SELECT 
                b.id,
                b.title, 
                b.author, 
                b.isbn, 
                b.published_year, 
                b.cover_path, 
                b.description,
                c.name as category_name 
             FROM books b 
             JOIN categories c ON c.id = b.category 
             WHERE c.name = ? AND b.id != ? 
             LIMIT 6`, // Maksimum 6 kitap göster
            [category, excludeId], 
            (err, rows) => {
                if(err) {
                    console.error("Database error:", err);
                    return res.status(500).json({error: "Database error"});
                }
                return res.status(200).json({books: rows});
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Getting same category books failed" });
    }
});

app.listen(PORT, () => {
  console.log(`Node.js backend working at: http://localhost:${PORT}`);
});
