import React from "react";
import "../style/BookCard.css";
import BookDetails from "./BookDetails";
import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div>
      <Link to={`/book/${book.id}`} className="card-link">
        <div className="card">
          <div className="card-cover">
            {book.cover_path ? (
              <img src={book.cover_path} alt={book.title} />
            ) : (
              <div className="no-cover">No Cover</div>
            )}
          </div>
          <div className="card-info">
            <h3 className="card-title">{book.title}</h3>
            <p className="card-author">by {book.author}</p>
            <p className="card-year">{book.published_year}</p>
            <p className="card-category">{book.category_name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;
