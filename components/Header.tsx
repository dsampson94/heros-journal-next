'use client';

import React, { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken } from '../lib/auth';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<null | { id: string; email: string; username: string }>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    useEffect(() => {
        const user = getUserFromToken();
        setUser(user);
    }, []);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const getInitial = (email: string) => {
        return email?.charAt(0)?.toUpperCase();
    };

    return (
        <header className="sticky top-0 z-49 bg-white text-black shadow-md">
            <div className="flex justify-between items-center p-1 md:p-2">
                <div className="flex items-center">
                </div>
                {user && (
                    <div className="relative">
                        <button onClick={handleMenuClick} className="focus:outline-none">
                            {/*{user.avatarUrl ? (*/}
                            {/*    <img*/}
                            {/*        className="w-8 h-8 md:w-10 md:h-10 rounded-full"*/}
                            {/*        src={user.avatarUrl}*/}
                            {/*        alt={user.email}*/}
                            {/*    />*/}
                            {/*) : (*/}
                                <div className="flex items-center justify-center w-8 mt-1.5 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white text-lg font-semibold">
                                    {getInitial(user?.email)}
                                </div>
                            {/*)}*/}
                        </button>
                        {open && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                            >
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={handleMenuClose}
                                >
                                    Profile
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={handleMenuClose}
                                >
                                    My account
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={handleSignOut}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
