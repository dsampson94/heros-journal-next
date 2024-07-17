// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import { verifyPassword, generateToken } from '../../../../lib/auth';
import User from '../../../../lib/models/User';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
}
