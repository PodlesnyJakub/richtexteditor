import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import all styles
import '../src/styles/editor.css';
import '../src/styles/toolbar.css';
import '../src/styles/pagination.css';
import '../src/styles/preview.css';
import '../src/styles/print.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
