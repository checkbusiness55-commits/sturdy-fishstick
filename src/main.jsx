
window.addEventListener('error', (event) => {
  document.body.innerHTML = '<div style="color:red;padding:15px;font-family:monospace;font-size:12px;word-break:break-all;"><b>CRASH:</b> ' + (event.message || 'Unknown') + '<br><br><b>File:</b> ' + event.filename + ':' + event.lineno + '</div>';
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
