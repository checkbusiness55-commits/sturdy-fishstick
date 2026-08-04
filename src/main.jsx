
window.addEventListener('error', (event) => {
  document.body.innerHTML = '<div style="color:red;padding:20px;font-family:monospace;word-break:break-all;"><h3>Runtime Error:</h3>' + event.message + '<br><small>' + event.filename + ':' + event.lineno + '</small></div>';
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
