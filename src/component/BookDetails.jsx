import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookCard from "./BookCard";
import "../style/BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [sameBooks, setSameBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookAndSameBooks = async () => {
      try {
        setLoading(true);

        // Önce kitap detaylarını getir
        const bookResponse = await axios.get(
          `http://localhost:3000/api/books/getbyid/${id}`
        );
        const bookData = bookResponse.data.book;
        setBook(bookData);

        // Sonra aynı kategorideki kitapları getir (mevcut kitap hariç)
        if (bookData.category_name) {
          const sameBooksResponse = await axios.get(
            `http://localhost:3000/api/books/getsamebooks/${bookData.category_name}?exclude=${id}`
          );
          setSameBooks(sameBooksResponse.data.books || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndSameBooks();
  }, [id]);

  if (loading) {
    return (
      <div className="book-details-container">
        <div className="loading-state">Loading book details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-container">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-container">
        <div className="error-state">Book not found</div>
      </div>
    );
  }

  // Yıldız rating için (şimdilik sabit değer)
  const renderStars = (rating = 4.2) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="star">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="book-details-container">
      <div className="book-details-grid">
        {/* Sol Taraf - Kitap Bilgileri */}
        <div className="book-info-section">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>

          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">Published Year</span>
              <span className="meta-value">{book.published_year}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">
                {book.category_name || "Not specified"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">ISBN</span>
              <span className="meta-value isbn-value">
                {book.isbn || "N/A"}
              </span>
            </div>
          </div>

          {/* Rating Bölümü */}
          <div className="rating-section">
            <div className="rating-title">Reader Rating</div>
            <div className="rating-stars">{renderStars()}</div>
            <div className="rating-value">4.2/5</div>
            <div className="rating-count">(128 reviews)</div>
          </div>

          {/* Açıklama Bölümü */}
          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <div className="book-description">
              {book.description || "No description available for this book."}
            </div>
          </div>

          {/* Benzer Kitaplar Bölümü */}
          {sameBooks.length > 0 && (
            <div className="same-books-section">
              <h3 className="section-title">More from {book.category_name}</h3>
              <div className="same-books-grid">
                {sameBooks.map((sameBook) => (
                  <BookCard key={sameBook.id} book={sameBook} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Kitap Kapağı ve Yorumlar */}
        <div className="book-cover-section">
          <div className="book-cover-large">
            {book.cover_path ? (
              <img
                src={book.cover_path}
                alt={book.title}
                className="cover-image"
              />
            ) : (
              <div className="no-cover-large">No Cover Available</div>
            )}
          </div>

          {/* Yorumlar Bölümü */}
          <div className="comments-section">
            <h3 className="section-title">Reader Comments</h3>
            <div className="comments-placeholder">
              <div className="comment-icon">💬</div>
              <h3>No comments yet</h3>
              <p>Be the first to share your thoughts about this book!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
