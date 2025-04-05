import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainMenu from './MainMenu';
import Driver from './components/players/Driver';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

