import { Theme, createTheme } from '@mui/material';

export const CustomTheme = (theme: any) => {
  return createTheme({
    palette: {
      primary: {
        main: '#1E88E5',
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
  });
};
