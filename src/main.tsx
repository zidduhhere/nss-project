import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { StudentAuthProvider } from './context/student/StudentAuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudentAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StudentAuthProvider>
  </StrictMode>

);
