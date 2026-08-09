import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    return (
        <div className="flex gap-1">
            {['pl', 'en'].map(lng => (
                <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${
                        i18n.language === lng
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );
};