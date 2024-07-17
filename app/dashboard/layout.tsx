'use client';

import React, { ReactNode } from 'react';
import AppLayout from '../../components/AppLayout';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return <AppLayout>{children}</AppLayout>;
}

export default Layout;
