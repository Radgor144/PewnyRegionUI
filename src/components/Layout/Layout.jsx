import React from 'react';

export const Layout = ({ children }) => {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-100">
            {children}
        </div>
    );
};