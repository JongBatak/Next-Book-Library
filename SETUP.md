# E-Library Full Stack Setup

## 🚀 Quick Start Guide

### 1. Install MongoDB Locally

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/elibrary
```

### 4. Seed the Database
Visit: http://localhost:3000/api/seed

This will create:
- 3 users (1 admin, 2 members)
- 12 books across various categories

### 5. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📚 API Endpoints

### Books
- `GET /api/books` - Get all books
  - Query params: `?search=keyword&category=Fiction&limit=10`
- `POST /api/books` - Create a new book

### Borrow System
- `POST /api/borrow` - Borrow a book
  - Body: `{ userId, bookId }`
- `GET /api/borrow?userId=xxx` - Get user's borrowed books

### Return System
- `POST /api/return` - Return a book
  - Body: `{ transactionId }`
- `GET /api/return` - Get overdue books
  - Query params: `?userId=xxx`

### Seed
- `GET /api/seed` - Seed database with dummy data

---

## 🗄️ Database Schema

### Book
- title (String, required)
- author (String, required)
- stock (Number, min: 0)
- category (Enum)
- coverImage (String)
- isbn (String, unique)
- publishYear (Number)

### User
- name (String, required)
- email (String, unique, required)
- role (Enum: admin/member)
- membershipNumber (String, unique)
- isActive (Boolean)

### Transaction
- userId (ObjectId, ref: User)
- bookId (ObjectId, ref: Book)
- borrowDate (Date)
- dueDate (Date)
- returnDate (Date)
- status (Enum: borrowed/returned/overdue)
- fine (Number, calculated: daysLate * 2000)

---

## 🎯 Features Implemented

✅ MongoDB connection with caching pattern
✅ Mongoose models with validation
✅ RESTful API routes
✅ Borrowing system with stock management
✅ Return system with automatic fine calculation (Rp 2,000/day)
✅ Overdue detection
✅ Real-time UI updates
✅ Error handling and validation
✅ Database seeding

---

## 🧪 Testing the System

1. **Seed Database**: Visit `/api/seed`
2. **View Books**: Check the homepage catalog
3. **Borrow a Book**: Click "Borrow Now" on any book card
4. **Check Stock**: Notice stock decrements
5. **Test API**: Use Postman or curl to test endpoints

---

## 📝 TODO (Future Enhancements)

- [ ] User authentication (NextAuth.js)
- [ ] Admin dashboard
- [ ] Search and filter UI
- [ ] Payment gateway for fines
- [ ] Email notifications
- [ ] Book reservations
- [ ] Reading history
- [ ] Reviews and ratings

---

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in `.env.local`

**"User not found" Error:**
- Run `/api/seed` first to create users
- Update `DUMMY_USER_ID` in `CatalogPreview.jsx`

**Build Errors:**
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

---

## 📞 Support

For issues, contact: library@prestasi.edu
