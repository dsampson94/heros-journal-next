'use client';

import {FormEvent, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {SelectField, TextField} from '../../../components/landing/Fields';
import {Button} from '../../../components/landing/Button';
import Image from 'next/image';
// import aplicaLogo from '../../../public/Applica_white.png';
import axios from 'axios';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [referralSource, setReferralSource] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const data = {email, username, password, referralSource};
            const response = await axios.post('/api/auth/register', data);
            setMessage(response.data.message);
            router.push('/login');
        } catch (error: any) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-6">
                <Link href="/" aria-label="Home">
                    {/*<Image src={aplicaLogo} alt="Applica Logo" width={150} height={200}/>*/}
                </Link>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 text-center">
                Get started for free
            </h2>
            <p className="mt-2 text-sm text-gray-700 text-center">
                Already registered?{' '}
                <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign in
                </Link>{' '}
                to your account.
            </p>
            <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <TextField
                    className="col-span-full"
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    className="col-span-full"
                    label="Username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    className="col-span-full"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <SelectField
                    className="col-span-full"
                    label="How did you hear about us?"
                    name="referral_source"
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                >
                    <option value="">Select an option</option>
                    <option value="AltaVista search">AltaVista search</option>
                    <option value="Super Bowl commercial">Super Bowl commercial</option>
                    <option value="Our route 34 city bus ad">Our route 34 city bus ad</option>
                    <option value="The “Never Use This” podcast">The “Never Use This” podcast</option>
                </SelectField>
                {message && <p className="text-red-500 text-sm col-span-full">{message}</p>}
                <div className="col-span-full">
                    <Button type="submit" variant="solid" color="blue" className="w-full mt-6">
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
