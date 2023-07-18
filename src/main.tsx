import { CookiesProvider } from 'react-cookie';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './app/app';
import { configureReduxStore } from './app/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={configureReduxStore()}>
    <BrowserRouter>
      <CookiesProvider>
        <App />
        <ToastContainer
          transition={Flip}
          position="top-center"
          limit={1}
          autoClose={2500}
          hideProgressBar={true}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme={'light'}
        />
      </CookiesProvider>
    </BrowserRouter>
  </Provider>
);
