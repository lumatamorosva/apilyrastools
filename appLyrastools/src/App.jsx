import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/theme";
import { Layout } from "./components/Layout/Layout";
import { Outlet } from 'react-router-dom'
import { CartProvider } from "./context/CartContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';

export default function App() { 
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);};
  return ( 
      <CartProvider>
        <ThemeProvider theme={appTheme}> 
          <CssBaseline enableColorScheme /> 
          <Layout t={t} changeLanguage={changeLanguage}> 
            <Outlet /> 
          </Layout> 
        </ThemeProvider>
      </CartProvider>
  ); 
}