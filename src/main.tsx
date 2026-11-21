import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import {startTimeOfDayIconScheduler} from './utils/appIconScheduler';
import {hideNativeSplashScreen, isNativeAndroidApp} from './utils/nativeAndroid';

const isNativeApp = isNativeAndroidApp();

if (!isNativeApp) {
  startTimeOfDayIconScheduler();
}

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.PROD && !isNativeApp) {
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
            void registration.update().catch(() => {});
          }
        });
      },
    });

    void updateSW;
  } else {
    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister()))
      )
      .catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(<App />);

if (isNativeApp && typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    void hideNativeSplashScreen();
  });
}
