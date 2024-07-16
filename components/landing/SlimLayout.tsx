import Image from 'next/image';
import backgroundImage from './images/background-auth.jpg';
import React from 'react';

export function SlimLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent shadow-2xl">
            <div className="relative flex min-h-full shrink-0 justify-center md:px-12 lg:px-0">
                <div
                    className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
                    <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                        {children}
                    </main>
                </div>
            </div>
            <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={backgroundImage}
                alt=""
                unoptimized
            />
        </div>
    );
}
