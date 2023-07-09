import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { configureReduxStore } from './app/redux/store';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={configureReduxStore()}>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </Provider>
);
