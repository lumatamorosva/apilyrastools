import { createTheme } from '@mui/material/styles'; 
export const appTheme= createTheme  ({ 
  palette: { 
    mode: 'light', 
    primary: { 
      main: '#498B97', 
    }, 
    secondary: { 
      main: '#6a948d', 
    }, 
    primaryLight: { 
        main: "#AA6262", 
        contrastText: "#AAAA60"  
      } 
  }, 
});
