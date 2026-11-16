import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let hasActiveController = Boolean(navigator.serviceWorker.controller);
  let hasReloadedForUpdate = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hasActiveController) {
      hasActiveController = true;
      return;
    }
    if (hasReloadedForUpdate) return;
    hasReloadedForUpdate = true;
    window.location.reload();
  });

  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          void registration.update();
        }
      });
    },
  });

  void updateSW;
}

createRoot(document.getElementById('root')!).render(<App />);
