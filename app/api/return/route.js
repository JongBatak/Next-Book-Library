import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import Transaction from '@/models/Transaction';

const FINE_PER_DAY = 2000; // Rp 2,000 per day

export async function POST(request) {
  try {
    await dbConnect();

    const { transactionId } = await request.json();

    // Validation
    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'transactionId is required',
        },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await Transaction.findById(transactionId)
      .populate('bookId', 'title author')
      .populate('userId', 'name email');

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: 'Transaction not found',
        },
        { status: 404 }
      );
    }

    // Check if already returned
    if (transaction.status === 'returned') {
      return NextResponse.json(
        {
          success: false,
          message: 'Book has already been returned',
        },
        { status: 400 }
      );
    }

    // Calculate fine
    const currentDate = new Date();
    const dueDate = new Date(transaction.dueDate);
    let fine = 0;
    let daysLate = 0;

    if (currentDate > dueDate) {
      daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * FINE_PER_DAY;
    }

    // Update transaction
    transaction.returnDate = currentDate;
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();

    // Increment book stock
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.stock += 1;
      await book.save();
    }

    // Format response message
    let message = `Successfully returned "${transaction.bookId.title}".`;
    if (fine > 0) {
      message += ` Late fee: Rp ${fine.toLocaleString('id-ID')} (${daysLate} days late).`;
    } else {
      message += ' No late fees. Thank you for returning on time!';
    }

    return NextResponse.json(
      {
        success: true,
        message,
        data: {
          transaction: {
            id: transaction._id,
            bookTitle: transaction.bookId.title,
            borrowDate: transaction.borrowDate,
            dueDate: transaction.dueDate,
            returnDate: transaction.returnDate,
            daysLate,
            fine,
            status: transaction.status,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Return Book Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to return book',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch overdue books
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const currentDate = new Date();

    let query = {
      status: 'borrowed',
      dueDate: { $lt: currentDate },
    };

    if (userId) {
      query.userId = userId;
    }

    const overdueTransactions = await Transaction.find(query)
      .populate('bookId', 'title author category')
      .populate('userId', 'name email membershipNumber')
      .sort({ dueDate: 1 });

    // Calculate fines for each
    const transactionsWithFines = overdueTransactions.map((trans) => {
      const daysLate = Math.ceil((currentDate - new Date(trans.dueDate)) / (1000 * 60 * 60 * 24));
      const calculatedFine = daysLate * FINE_PER_DAY;

      return {
        ...trans.toObject(),
        daysLate,
        calculatedFine,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: transactionsWithFines.length,
        data: transactionsWithFines,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Overdue Books Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch overdue books',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
