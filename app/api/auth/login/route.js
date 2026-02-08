import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // In production, you should hash passwords and compare
    // For demo purposes, we're using simple comparison
    // if (password !== 'password123') { // Simple check
    //   return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    // }

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
        message: 'Login successful',
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
