import React from 'react';
import ReactDOM from 'react-dom/client';
import './lib/i18n';
import './index.css';
import {App} from './app/App';
import {ThemeProvider} from "./app/providers/ThemeContext";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);