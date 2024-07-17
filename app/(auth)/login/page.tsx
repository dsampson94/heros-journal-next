'use client';

import Link from 'next/link';

import {Button} from '../../../components/landing/Button';
import {TextField} from 'components/landing/Fields';
import {FormEvent, useState} from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
// import aplicaLogo from '../../../public/Applica_white.png';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('/api/auth/login', {username, password});
            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                router.push('/dashboard');
            } else {
                setMessage(response.data.message);
            }
        } catch (error: any) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-6">
                {/*<Image src={aplicaLogo} alt="Applica Logo" width={150} height={200} />*/}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 text-center">
                {isLogin ? 'Sign in to your account' : 'Register for an account'}
            </h2>
            <p className="mt-2 text-sm text-gray-700 text-center">
                Don’t have an account?{' '}
                <Link
                    href="/register"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-blue-600 hover:underline"
                >
                    {isLogin ? 'Sign up' : 'Sign in'}
                </Link>{' '}
                for a free trial.
            </p>
            <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-3">
                <TextField
                    label="Username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div>
                    <Button type="submit" variant="solid" color="blue" className="w-full mt-6">
            <span>
              {isLogin ? 'Sign in' : 'Register'} <span aria-hidden="true">&rarr;</span>
            </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}