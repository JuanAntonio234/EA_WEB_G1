import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n'; 
import { AccessibilityProvider } from './context/AccessibilityContext'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <AccessibilityProvider>
        <App/>
      </AccessibilityProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);