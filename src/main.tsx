import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { withPlugins } from './plugins/index.ts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>{withPlugins(<App />)}</StrictMode>
);
