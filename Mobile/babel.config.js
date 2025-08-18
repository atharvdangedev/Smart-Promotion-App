module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel'
  ],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',        // Path to your .env file
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
