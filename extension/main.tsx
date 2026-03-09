import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomeClient from '../src/app/HomeClient';
import '../src/app/globals.css';
import './extension.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomeClient />
  </StrictMode>
);
