import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Carregant...</div>}> 
      <GoogleOAuthProvider clientId={import.meta.env.VITE_API_BASE_URL}> 
        <App />
      </GoogleOAuthProvider>
    </Suspense>
  </StrictMode>,
);
