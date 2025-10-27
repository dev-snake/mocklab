import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/customize.css';
import './core/i18n/config';
import App from './App.tsx';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Toaster />
    </StrictMode>
);
