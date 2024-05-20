import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { ThemeContextProvider } from './Contexts/ThemeContext';
import { SocketProvider } from './Contexts/SocketProvider';
import { MessageProvider } from './Contexts/MessageProvider';
import { LoadingProvider } from './Contexts/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeContextProvider>

    <BrowserRouter>
      <SocketProvider>
        <LoadingProvider>

        <MessageProvider>
        <App />
        </MessageProvider>
        </LoadingProvider>
      </SocketProvider>
    </BrowserRouter>
  </ThemeContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
