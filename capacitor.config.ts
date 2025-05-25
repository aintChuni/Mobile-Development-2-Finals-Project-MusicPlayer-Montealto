import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MusicPlayer',
  webDir: 'www',

  plugins: {
    DeepLinking: {
      schemes: ['myapp'],
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#2034b3",
      androidScaleType: "CENTER_CROP",
      iosContentMode: "ScaleAspectFill",
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2034b3'
    }
  }
};

export default config;
