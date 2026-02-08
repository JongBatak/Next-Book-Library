'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import MaskedText from './ui/MaskedText';
import GlareHover from './Glare/GlareHover';

// Color mapping for categories
const categoryColors = {
  'Fiction': 'from-purple-500 to-pink-500',
  'Self-Help': 'from-blue-500 to-cyan-500',
  'Sci-Fi': 'from-orange-500 to-red-500',
  'Business': 'from-green-500 to-emerald-500',
  'History': 'from-yellow-500 to-orange-500',
  'Philosophy': 'from-indigo-500 to-purple-500',
  'Non-Fiction': 'from-gray-500 to-slate-500',
  'Science': 'from-teal-500 to-cyan-500',
  'Arts': 'from-pink-500 to-rose-500',
  'Technology': 'from-violet-500 to-purple-500',
};

// Dummy user ID for testing (in production, get from auth context)
const DUMMY_USER_ID = '507f1f77bcf86cd799439011';

export default function CatalogPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId, bookTitle) => {
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: DUMMY_USER_ID,
          bookId: bookId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}`);
        // Refresh books to update stock
        fetchBooks();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      alert('❌ Failed to borrow book. Please try again.');
    }
  };

  return (
    <section ref={containerRef} className="relative bg-gray-50 py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-gray-500 font-light">
              Our Collection
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-3">
              <MaskedText delay={0.2}>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
                  TRENDING
                </h2>
              </MaskedText>
              <MaskedText delay={0.4}>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-gray-900">
                  Books
                </h2>
              </MaskedText>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={fetchBooks}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300 self-start md:self-auto"
            >
              {loading ? 'Loading...' : 'Refresh Catalog'}
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBooks}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-600 mt-4">
              💡 Tip: Make sure MongoDB is running and you've seeded the database by visiting{' '}
              <a href="/api/seed" className="text-blue-600 underline" target="_blank">
                /api/seed
              </a>
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <BookCard
                key={book._id}
                book={book}
                index={index}
                isInView={isInView}
                onBorrow={handleBorrow}
              />
            ))}
          </div>
        )}

        {/* No Books State */}
        {!loading && !error && books.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800 mb-4">No books found in the database.</p>
            <p className="text-sm text-gray-600 mb-4">
              Please seed the database first by visiting:
            </p>
            <a
              href="/api/seed"
              target="_blank"
              className="inline-block px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Seed Database
            </a>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-xl text-gray-600 mb-6">
            Explore over <span className="font-bold text-gray-900">50,000+ titles</span> across all genres
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Fiction', 'Science', 'History', 'Business', 'Technology', 'Arts'].map((genre) => (
              <span
                key={genre}
                className="px-5 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:border-gray-900 transition-colors cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BookCard({ book, index, isInView, onBorrow }) {
  const [isBorrowing, setIsBorrowing] = useState(false);
  
  const categoryColor = categoryColors[book.category] || 'from-gray-500 to-slate-500';

  const handleBorrowClick = async () => {
    setIsBorrowing(true);
    await onBorrow(book._id, book.title);
    setIsBorrowing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group cursor-pointer"
    >
      <div className="relative bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500">
        {/* Book Cover - Gradient Placeholder with Glare Effect */}
        <div className="relative overflow-hidden">
          <GlareHover
            width="100%"
            height="100%"
            background="transparent"
            borderRadius="0px"
            borderColor="transparent"
            glareColor="#ffffff"
            glareOpacity={0.4}
            glareAngle={-45}
            glareSize={200}
            transitionDuration={800}
            playOnce={false}
            style={{ border: 'none', display: 'block' }}
          >
            <div className={`h-96 w-full relative bg-gradient-to-br ${categoryColor}`}>
              {book.coverImage ? (
                <div className="absolute inset-0">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                </div>
              ) : (
                <div className="absolute inset-0" />
              )}

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          </GlareHover>
          
          {/* Stock Badge */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className={`px-3 py-1 text-xs font-bold ${
              book.stock > 5 ? 'bg-green-500' : book.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
            } text-white rounded-full`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleBorrowClick}
              disabled={book.stock <= 0 || isBorrowing}
              className={`w-full text-white text-sm font-medium border border-white px-4 py-2 transition-colors pointer-events-auto ${
                book.stock > 0 && !isBorrowing
                  ? 'hover:bg-white hover:text-black'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isBorrowing ? 'Processing...' : book.stock > 0 ? 'Borrow Now' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-6">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              {book.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-3">by {book.author}</p>
          
          {book.publishYear && (
            <p className="text-sm text-gray-500 mb-3">Published: {book.publishYear}</p>
          )}

          {/* Rating Placeholder */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">(245)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
