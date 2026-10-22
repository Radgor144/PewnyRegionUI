import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    filters?: ReactNode;
    details?: ReactNode;
}

export const DashboardLayout = ({ sidebar, content, filters, details }: DashboardLayoutProps) => {
    return (
        <div
            className="relative w-full h-screen overflow-hidden font-sans"
            style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
            }}
        >
            <div className="absolute inset-0 z-0">
                {content}
            </div>

            <div className="absolute top-14 left-0 bottom-0 z-30 flex">
                {sidebar}
            </div>

            {filters}
            {details}

            <div className="absolute top-0 left-0 right-0 z-50">
                <TopBar />
            </div>
        </div>
    );
};