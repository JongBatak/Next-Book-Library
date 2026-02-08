'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Redirect admin to admin dashboard
    if (parsedUser.role === 'admin') {
      router.push('/dashboard/admin');
      return;
    }

    setUser(parsedUser);
    fetchBorrowedBooks(parsedUser.id);
  }, [router]);

  const fetchBorrowedBooks = async (userId) => {
    try {
      const response = await fetch(`/api/borrow?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setBorrowedBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId) => {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
      const response = await fetch('/api/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Book returned successfully! ${data.data.fine > 0 ? `Fine: Rp ${data.data.fine.toLocaleString()}` : 'No fine.'}`);
        fetchBorrowedBooks(user.id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to return book');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            <p className="text-white/60 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition">
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/60 text-sm">Name</p>
              <p className="text-white font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Email</p>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Membership Number</p>
              <p className="text-white font-semibold">{user?.membershipNumber}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Role</p>
              <p className="text-white font-semibold capitalize">{user?.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30"
          >
            <p className="text-blue-300 text-sm mb-2">Borrowed Books</p>
            <p className="text-4xl font-bold text-white">{borrowedBooks.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30"
          >
            <p className="text-green-300 text-sm mb-2">Available Slots</p>
            <p className="text-4xl font-bold text-white">{5 - borrowedBooks.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30"
          >
            <p className="text-purple-300 text-sm mb-2">Total Fines</p>
            <p className="text-4xl font-bold text-white">Rp 0</p>
          </motion.div>
        </div>

        {/* Borrowed Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">My Borrowed Books</h2>
          
          {borrowedBooks.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 text-center border border-white/10">
              <p className="text-white/60 text-lg">You haven't borrowed any books yet.</p>
              <Link
                href="/catalog"
                className="inline-block mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {borrowedBooks.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {transaction.bookId?.title}
                    </h3>
                    <p className="text-white/60 mb-2">by {transaction.bookId?.author}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-white/60">
                        Borrowed: {new Date(transaction.borrowDate).toLocaleDateString()}
                      </span>
                      <span className="text-white/60">
                        Due: {new Date(transaction.dueDate).toLocaleDateString()}
                      </span>
                      {new Date(transaction.dueDate) < new Date() && (
                        <span className="text-red-400 font-semibold">OVERDUE</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturnBook(transaction._id)}
                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition"
                  >
                    Return Book
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
