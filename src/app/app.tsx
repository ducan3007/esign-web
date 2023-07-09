import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import './global.styles.scss';
import { ThemeProvider } from '@mui/material';
import { CustomTheme } from './theme';
import { SignupPage } from './pages/Signup';

export function App() {
  const customizedTheme = CustomTheme('default');
  
  return (
    <ThemeProvider theme={customizedTheme}>
      <React.Fragment>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicPage>
                <LoginPage />
              </PublicPage>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicPage>
                <SignupPage />
              </PublicPage>
            }
          />
        </Routes>
      </React.Fragment>
    </ThemeProvider>
  );
}

function PublicPage({ children }: { children: any }) {
  return children;
}

export default App;
