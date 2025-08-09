import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('es')}>ES</button>
    </div>
  );
};

export default LanguageSelector;