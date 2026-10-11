import { useTranslation } from 'react-i18next';
import { BRAND_BLUE } from 'lib/colors';

const LANGUAGES = ['pl', 'en'] as const;
type Language = typeof LANGUAGES[number];

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    return (
        <div className="flex gap-1.5">
            {LANGUAGES.map((lng: Language) => (
                <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className="h-8 min-w-[32px] px-2 text-[10px] font-bold rounded-md transition-colors"
                    style={{
                        backgroundColor: i18n.language === lng ? BRAND_BLUE : 'var(--color-panel-alt)',
                        color: i18n.language === lng ? '#ffffff' : 'var(--color-text)',
                    }}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );
};