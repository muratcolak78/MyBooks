import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import "../style/Home.css"; // CSS'i import edin

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBooksUrl = "http://localhost:3000/api/books/getallbooks";

  useEffect(() => {
    setLoading(true);

    axios
      .get(getBooksUrl)
      .then((response) => {
        setBooks(response.data.books);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setError("Failed to load books");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div>
        <h1>Welcome to Books World</h1>
        <p>Discover our collection of amazing books</p>

        {books && books.length > 0 ? (
          <div className="books-grid">
            {books.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>
        ) : (
          <div className="no-books">
            <p>No books found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
