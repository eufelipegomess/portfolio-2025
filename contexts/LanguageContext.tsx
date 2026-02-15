import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    // Try to get language from local storage
    const savedLang = localStorage.getItem('felipe_portfolio_lang') as Language;
    if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
      setLanguage(savedLang);
    } else {
        // Optional: Detect browser language
        const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
        setLanguage(browserLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('felipe_portfolio_lang', lang);
  };

  const toggleLanguage = () => {
      handleSetLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};