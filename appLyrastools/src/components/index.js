import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // IMPORTANTE: cargar la configuración de i18n aquí

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);