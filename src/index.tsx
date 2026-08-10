import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'context/ThemeContext';
import './index.css';
import './i18n/config';
import App from './App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);