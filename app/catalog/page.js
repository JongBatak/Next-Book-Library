'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Business', 'Arts', 'Self-Help', 'Philosophy', 'Sci-Fi'];

export default function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
        setFilteredBooks(data.data);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleBorrow = async (bookId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      alert('Please login first!');
      return;
    }

    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bookId }),
      });

      const data = await response.json();
      alert(data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
      
      if (data.success) fetchBooks();
    } catch (err) {
      alert('❌ Failed to borrow book');
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Book Catalog</h1>
              <p className="text-gray-600 mt-1">Browse our collection of {books.length} books</p>
            </div>
            <Link href="/" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              ← Back Home
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">Showing {Math.min(displayCount, filteredBooks.length)} of {filteredBooks.length} books</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredBooks.slice(0, displayCount).map((book, index) => (
                <BookCard key={book._id} book={book} index={index} onBorrow={handleBorrow} />
              ))}
            </div>

            {/* Load More */}
            {displayCount < filteredBooks.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-12"
              >
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Load More Books
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BookCard({ book, index, onBorrow }) {
  const [isBorrowing, setIsBorrowing] = useState(false);

  const handleBorrow = async () => {
    setIsBorrowing(true);
    await onBorrow(book._id);
    setIsBorrowing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            book.stock > 5 ? 'bg-green-500' : book.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
          } text-white`}>
            {book.stock > 0 ? `${book.stock}` : 'Out'}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">{book.category}</span>
        <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 text-sm group-hover:text-gray-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
        
        <button
          onClick={handleBorrow}
          disabled={book.stock <= 0 || isBorrowing}
          className={`w-full mt-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            book.stock > 0 && !isBorrowing
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isBorrowing ? 'Processing...' : book.stock > 0 ? 'Borrow' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}
