import React, {ReactNode} from 'react';
import {SlimLayout} from '../../../components/landing/SlimLayout';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    return <SlimLayout>{children}</SlimLayout>;

};

export default AuthLayout;
