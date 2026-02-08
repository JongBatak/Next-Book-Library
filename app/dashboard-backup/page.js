'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data states
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    returnedToday: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  
  // CRUD states
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    try {
      const booksRes = await fetch('/api/books');
      const booksData = await booksRes.json();
      
      const transRes = await fetch('/api/borrow');
      const transData = await transRes.json();
      
      if (booksData.success) setAllBooks(booksData.data);
      if (transData.success) {
        setAllTransactions(transData.data);
        setRecentActivity(transData.data.slice(0, 10));
      }
      
      setStats({
        totalBooks: booksData.data?.length || 0,
        totalUsers: 25,
        activeBorrows: transData.data?.filter(t => !t.returnDate).length || 0,
        returnedToday: transData.data?.filter(t => {
          if (!t.returnDate) return false;
          const today = new Date().toDateString();
          return new Date(t.returnDate).toDateString() === today;
        }).length || 0
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCreateBook = async () => {
    if (!bookForm.title || !bookForm.author) return;
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm)
      });
      
      if (response.ok) {
        fetchAllData();
        setBookForm({ title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: '' });
      }
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };

  const handleUpdateBook = async () => {
    if (!editingBook || !bookForm.title || !bookForm.author) return;
    
    try {
      const response = await fetch(`/api/books?id=${editingBook}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm)
      });
      
      if (response.ok) {
        fetchAllData();
        setEditingBook(null);
        setBookForm({ title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: '' });
      }
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Delete this book?')) return;
    
    try {
      await fetch(`/api/books?id=${bookId}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const startEditBook = (book) => {
    setEditingBook(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      category: book.category || '',
      quantity: book.quantity || 1,
      coverImage: book.coverImage || ''
    });
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setBookForm({ title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: '' });
  };

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Admin Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed left-0 top-0 h-full w-72 bg-slate-800/50 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60 text-sm mb-1">Logged in as</p>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-white/40 text-xs">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Toggle Sidebar Button (Mobile) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 lg:hidden bg-purple-600 text-white p-3 rounded-lg shadow-lg"
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard title="Total Books" value={stats.totalBooks} icon="📚" gradient="from-blue-500 to-cyan-500" />
                  <StatCard title="Total Users" value={stats.totalUsers} icon="👥" gradient="from-green-500 to-emerald-500" />
                  <StatCard title="Active Borrows" value={stats.activeBorrows} icon="📖" gradient="from-orange-500 to-red-500" />
                  <StatCard title="Returned Today" value={stats.returnedToday} icon="✅" gradient="from-purple-500 to-pink-500" />
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.length === 0 ? (
                      <p className="text-white/50">No recent activity</p>
                    ) : (
                      recentActivity.map((trans, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{trans.bookId?.title || 'Book'}</p>
                            <p className="text-white/50 text-sm">{trans.userId?.name || 'User'}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${trans.returnDate ? 'text-green-400' : 'text-orange-400'}`}>
                              {trans.returnDate ? 'Returned' : 'Active'}
                            </p>
                            <p className="text-white/40 text-xs">
                              {new Date(trans.borrowDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'books' && (
              <motion.div
                key="books"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-bold text-white mb-8">Book Management</h2>
                
                {/* Book Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                    <input
                      type="text"
                      placeholder="ISBN"
                      value={bookForm.isbn}
                      onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={bookForm.category}
                      onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={bookForm.quantity}
                      onChange={(e) => setBookForm({ ...bookForm, quantity: parseInt(e.target.value) })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={bookForm.coverImage}
                      onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={editingBook ? handleUpdateBook : handleCreateBook}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      {editingBook ? 'Update Book' : 'Add Book'}
                    </button>
                    {editingBook && (
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                  />
                </div>

                {/* Books List */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">All Books ({filteredBooks.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredBooks.map((book) => (
                      <div key={book._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{book.title}</p>
                          <p className="text-white/60 text-sm">{book.author}</p>
                          <p className="text-white/40 text-xs">{book.category} • Qty: {book.quantity}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditBook(book)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-bold text-white mb-8">Transaction History</h2>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {allTransactions.length === 0 ? (
                      <p className="text-white/50">No transactions yet</p>
                    ) : (
                      allTransactions.map((trans) => (
                        <div key={trans._id} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-semibold">{trans.bookId?.title || 'N/A'}</p>
                              <p className="text-white/60 text-sm">{trans.userId?.name || 'N/A'}</p>
                              <p className="text-white/40 text-xs mt-1">
                                Borrowed: {new Date(trans.borrowDate).toLocaleDateString()}
                              </p>
                              {trans.dueDate && (
                                <p className="text-white/40 text-xs">
                                  Due: {new Date(trans.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                trans.returnDate
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {trans.returnDate ? 'Returned' : 'Active'}
                              </span>
                              {trans.returnDate && (
                                <p className="text-white/40 text-xs mt-2">
                                  {new Date(trans.returnDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-bold text-white mb-8">Analytics & Insights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Borrow Rate</h3>
                    <div className="text-5xl font-bold text-purple-400 mb-2">
                      {stats.activeBorrows > 0 ? Math.round((stats.activeBorrows / stats.totalBooks) * 100) : 0}%
                    </div>
                    <p className="text-white/60">Of books currently borrowed</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Return Rate</h3>
                    <div className="text-5xl font-bold text-green-400 mb-2">
                      {allTransactions.length > 0
                        ? Math.round((allTransactions.filter(t => t.returnDate).length / allTransactions.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-white/60">Books returned on time</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-bold text-white mb-8">User Management</h2>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <p className="text-white/70">User management coming soon...</p>
                  <p className="text-white/50 text-sm mt-2">Total Users: {stats.totalUsers}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{icon}</span>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} opacity-20`}></div>
        </div>
        <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}
