import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ResetPassword from './components/Auth/ResetPassword';
import './index.css';

const Root = () => {
  const path = window.location.pathname;
  if (path === '/reset-password') {
    return <ResetPassword />;
  }
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
