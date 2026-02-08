import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 0;

    let query = {};

    // Search by title, author, or category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    const books = await Book.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: books.length,
        data: books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Books Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch books',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const book = await Book.create(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Book created successfully',
        data: book,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Book Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create book',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
