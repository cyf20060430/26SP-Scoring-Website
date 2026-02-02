// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';   // 引入 App 作为入口

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />   {/* 在这里挂载 App */}
  </React.StrictMode>
);
