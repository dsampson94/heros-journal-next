import {NextRequest, NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

// Interface for the decoded token structure
interface DecodedToken {
    id: string;
    email: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
    jti: string;
}

// Function to verify the JWT token from the request's authorization header
export const verifyToken = (req: NextRequest): DecodedToken => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
};

// Function to handle server response objects
export function handleResponse(resourceName: string, message: string = '', data: any = null,) {
    if (data) {
        return NextResponse.json(data);
    } else {
        console.error(`Error handling ${resourceName}: ${message}`);
        return NextResponse.json({error: `Error handling ${resourceName}: ${message}`});
    }
}