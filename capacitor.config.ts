import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.achsoo.app',
  appName: 'Achsoo',
  webDir: 'dist',
  backgroundColor: '#171412',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#171412',
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'DARK',
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
      backgroundColor: '#171412',
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: false,
      backgroundColor: '#171412',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
