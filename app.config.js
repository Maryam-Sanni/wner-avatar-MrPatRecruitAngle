import 'dotenv/config';

export default ({ config }) => {
  // Determine the environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Return the configuration with environment-specific values
  return {
    ...config,
    name: 'anglequest',
    slug: 'anglequest',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.anglequest',
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['myapp'],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.yourcompany.anglequest',
      intentFilters: [
        {
          action: 'VIEW',
          data: [{ scheme: 'myapp' }],
          category: ['DEFAULT', 'BROWSABLE'],
        },
      ],
    },
    web: {
      favicon: './assets/Recruitangle Icon.png',
      source: './src/index.html',
      config: {
        navigation: {
          root: '/',
        },
      },
    },
    extra: {
      apiUrl: isDevelopment ? 'https://recruitangle.com' : 'https://prod.recruitangle.com',
    },
    plugins: [
      [
        'expo-font',
        {
          fonts: {
            'Varta-Medium': './assets/fonts/Varta-Medium.ttf',
            'Ubuntu-Light': './assets/fonts/Ubuntu-Light.ttf',
            'Ubuntu-Bold': './assets/fonts/Ubuntu-Bold.ttf',
            'Ubuntu-Medium': './assets/fonts/Ubuntu-Medium.ttf',
            'Ubuntu-Regular': './assets/fonts/Ubuntu-Regular.ttf',
            'Roboto-Bold': './assets/fonts/Roboto-Bold.ttf',
            'Roboto-Light': './assets/fonts/Roboto-Light.ttf',
            'Roboto-Regular': './assets/fonts/Roboto-Regular.ttf',
            'Sora-Bold': './assets/fonts/Sora-Bold.ttf',
            'Sora-Regular': './assets/fonts/Sora-Regular.ttf',
            'Sora-Light': './assets/fonts/Sora-Light.ttf',
          },
        },
      ],
    ],
  };
};
