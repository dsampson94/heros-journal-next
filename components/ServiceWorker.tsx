import React, { useEffect } from 'react';

const ServiceWorker: React.FC = () => {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }, []);

    return <link rel="manifest" href="/manifest.json"/>;
};

export default ServiceWorker;
