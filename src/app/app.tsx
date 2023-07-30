import { ThemeProvider } from '@mui/material';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FallbackLoading } from './components/Loading';
import './global.styles.scss';
import { RouteObject, appRoutes } from './routes';
import { CustomTheme } from './theme';
import DashboardLayout from './layouts/DashboardLayout';

export function App() {
  const customizedTheme = CustomTheme('default');

  return (
    <ThemeProvider theme={customizedTheme}>
      <React.Fragment>
        <Suspense fallback={<FallbackLoading />}>
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
            {/* 404 */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="/signup" element={<SignupPage />} />M */}
          </Routes>
        </Suspense>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
