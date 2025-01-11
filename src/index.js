import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppThemeProvider from 'themes/AppThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AppThemeProvider>
);
