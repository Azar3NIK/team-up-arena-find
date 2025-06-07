// src/main.tsx

import React from 'react'; // 1. Импортируем React
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // 2. Импортируем наш новый AuthProvider

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>  {/* 3. Оборачиваем все в StrictMode для лучших проверок в разработке */}
      <AuthProvider>  {/* 4. Оборачиваем App в AuthProvider */}
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Не удалось найти корневой элемент с id 'root'");
}