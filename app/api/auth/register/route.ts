// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import { hashPassword } from '../../../../lib/auth';
import User from '../../../../lib/models/User';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
        return NextResponse.json({ message: 'Username, email, and password are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({ user }, { status: 201 });
}
