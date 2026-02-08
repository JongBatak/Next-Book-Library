import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
      maxlength: [100, 'Author name cannot be more than 100 characters'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Business', 'Arts', 'Self-Help', 'Philosophy', 'Sci-Fi'],
      default: 'Fiction',
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      default: '',
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publishYear: {
      type: Number,
      min: [1000, 'Invalid publish year'],
      max: [new Date().getFullYear(), 'Publish year cannot be in the future'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
BookSchema.index({ title: 'text', author: 'text', category: 'text' });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
