import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    id: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: { id: string; email: string }): string => {
    return jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });
};

export const getAuthHeaders = (): { Authorization: string } => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return {Authorization: `Bearer ${token}`};
};

export const getUserIdFromToken = (): string => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const decoded: DecodedToken = jwtDecode(token);
    return decoded.id;
};


export const getUserFromToken = (): DecodedToken | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};