import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import JoinPage from './components/JoinPage';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Fail loudly if the HTML shell ever drifts from the React entrypoint.
  throw new Error("Could not find root element to mount to");
}

const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/';
const Page = normalizedPath === '/join' ? JoinPage : App;

createRoot(rootElement).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
