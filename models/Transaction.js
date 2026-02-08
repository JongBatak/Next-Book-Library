import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed',
    },
    fine: {
      type: Number,
      default: 0,
      min: [0, 'Fine cannot be negative'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ bookId: 1, status: 1 });
TransactionSchema.index({ dueDate: 1 });

// Virtual to check if overdue
TransactionSchema.virtual('isOverdue').get(function () {
  if (this.status === 'borrowed' && this.dueDate < new Date()) {
    return true;
  }
  return false;
});

// Method to calculate fine
TransactionSchema.methods.calculateFine = function (finePerDay = 2000) {
  if (this.status === 'returned' || !this.dueDate) return 0;

  const currentDate = new Date();
  const dueDate = new Date(this.dueDate);

  if (currentDate <= dueDate) return 0;

  const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
  return daysLate * finePerDay;
};

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
