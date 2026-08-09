import React from 'react';

export const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            {children}
        </div>
    );
};