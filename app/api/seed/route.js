import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import User from '@/models/User';

// Book cover images from Unsplash - diverse collection
const bookCovers = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1491841651911-c44c30c34548?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1509266272358-7701da638078?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=600',
  'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=400&h=600',
];

const bookTitles = [
  'The Midnight Chronicles', 'Echoes of Eternity', 'Digital Dreams', 'The Last Algorithm',
  'Beyond the Horizon', 'Whispers in Time', 'The Quantum Paradox', 'Shadows of Tomorrow',
  'The Silent Observer', 'Fragments of Memory', 'The Endless Journey', 'Cosmic Revelations',
  'The Hidden Truth', 'Waves of Change', 'The Final Chapter', 'Parallel Lives',
  'The Forgotten Kingdom', 'Mindscape', 'The Sacred Code', 'Infinite Possibilities'
];

const authors = [
  'Alexandra Moore', 'Benjamin Cross', 'Catherine Liu', 'Daniel Foster',
  'Emma Richardson', 'Frank Martinez', 'Grace Thompson', 'Henry Park',
  'Isabella Chen', 'James Wilson', 'Katherine Brown', 'Lucas Anderson',
  'Maria Garcia', 'Nathan Cooper', 'Olivia Taylor', 'Patrick Murphy'
];

const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Business', 'Arts', 'Self-Help', 'Philosophy', 'Sci-Fi'];

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});

    // Create dummy users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@prestasi.edu',
        role: 'admin',
        membershipNumber: 'ADMIN001',
        phone: '+62 812 3456 7890',
      },
      {
        name: 'John Doe',
        email: 'john.doe@prestasi.edu',
        role: 'member',
        membershipNumber: 'MEM001',
        phone: '+62 813 1111 1111',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@prestasi.edu',
        role: 'member',
        membershipNumber: 'MEM002',
        phone: '+62 813 2222 2222',
      },
    ]);

    // Generate 50 books
    const books = [];
    for (let i = 0; i < 50; i++) {
      const titleBase = bookTitles[i % bookTitles.length];
      const author = authors[i % authors.length];
      const category = categories[i % categories.length];
      const coverImage = bookCovers[i % bookCovers.length];
      
      books.push({
        title: i < 20 ? titleBase : `${titleBase} Vol. ${Math.floor(i / 20) + 1}`,
        author: author,
        stock: Math.floor(Math.random() * 15) + 1, // 1-15 stock
        category: category,
        coverImage: coverImage,
        description: `An engaging ${category.toLowerCase()} book that will captivate readers with its unique perspective and compelling narrative. ${titleBase} offers a journey into ${category.toLowerCase()} that you won't forget.`,
        publishYear: 2015 + Math.floor(Math.random() * 10), // 2015-2024
        isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      });
    }

    const createdBooks = await Book.insertMany(books);

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully with 50 books!',
        data: {
          users: users.length,
          books: createdBooks.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
