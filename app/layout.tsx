'use client';

import './globals.css';

import React from 'react';
import ServiceWorker from '../components/ServiceWorker';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
        <head>
            <title>Heros Journal</title>
            <ServiceWorker/>
        </head>
        <body className="flex h-full flex-col">{ children }</body>
        </html>
    );
};

export default Layout;
