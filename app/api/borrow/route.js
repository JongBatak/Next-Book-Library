import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request) {
  try {
    await dbConnect();

    const { userId, bookId } = await request.json();

    // Validation
    if (!userId || !bookId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId and bookId are required',
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: 'User account is inactive. Please contact admin.',
        },
        { status: 403 }
      );
    }

    // Check if book exists and has stock
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book not found',
        },
        { status: 404 }
      );
    }

    if (book.stock <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book is currently out of stock',
        },
        { status: 400 }
      );
    }

    // Check if user already has this book borrowed
    const existingTransaction = await Transaction.findOne({
      userId,
      bookId,
      status: 'borrowed',
    });

    if (existingTransaction) {
      return NextResponse.json(
        {
          success: false,
          message: 'You already have this book borrowed',
        },
        { status: 400 }
      );
    }

    // Check borrowing limit (max 5 books at a time)
    const activeBorrowings = await Transaction.countDocuments({
      userId,
      status: 'borrowed',
    });

    if (activeBorrowings >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have reached the maximum borrowing limit (5 books)',
        },
        { status: 400 }
      );
    }

    // Calculate due date (7 days from now)
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Create transaction
    const transaction = await Transaction.create({
      userId,
      bookId,
      borrowDate,
      dueDate,
      status: 'borrowed',
    });

    // Decrement book stock
    book.stock -= 1;
    await book.save();

    // Populate transaction with book and user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('bookId', 'title author category')
      .populate('userId', 'name email membershipNumber');

    return NextResponse.json(
      {
        success: true,
        message: `Successfully borrowed "${book.title}". Due date: ${dueDate.toLocaleDateString()}`,
        data: populatedTransaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Borrow Book Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to borrow book',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's borrowed books
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    const transactions = await Transaction.find({
      userId,
      status: 'borrowed',
    })
      .populate('bookId', 'title author category coverImage')
      .sort({ borrowDate: -1 });

    return NextResponse.json(
      {
        success: true,
        count: transactions.length,
        data: transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Borrowed Books Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch borrowed books',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
