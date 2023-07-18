import { ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './global.styles.scss';
import { RouteObject, appRoutes } from './routes';
import { CustomTheme } from './theme';

export function App() {
  const customizedTheme = CustomTheme('default');

  return (
    <ThemeProvider theme={customizedTheme}>
      <React.Fragment>
        <Routes>
          {appRoutes.map((route: RouteObject, index: number) => {
            const Component = route.component;
            const Layout = route.layout;
            if (Layout) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Component />
                    </Layout>
                  }
                />
              );
            }

            return <Route key={index} path={route.path} element={<Component />} />;
          })}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/signup" element={<SignupPage />} />M */}
        </Routes>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
