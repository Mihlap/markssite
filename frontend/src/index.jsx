import React, { lazy, Suspense } from 'react';
import axios from 'axios';
import './fonts.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { IS_DEV } from './const/is-dev';
import { queryClient } from './lib/queryClient';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

axios.defaults.withCredentials = true;

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      {IS_DEV && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  </BrowserRouter>
);
