import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered',
        },
        { status: 400 }
      );
    }

    // Generate membership number
    const count = await User.countDocuments();
    const membershipNumber = `MEM${(count + 1).toString().padStart(4, '0')}`;

    // Create user (In production, hash the password!)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      role: 'member',
      membershipNumber,
      isActive: true,
    });

    // Return user data (exclude sensitive info)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      membershipNumber: user.membershipNumber,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Registration failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
