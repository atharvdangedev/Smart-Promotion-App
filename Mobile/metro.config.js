const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
* Metro configuration
* https://reactnative.dev/docs/metro
*
* @type {import('@react-native/metro-config').MetroConfig}
*/
const config = {
    // If you have additional custom config, include it here.
};

const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = withNativeWind(mergedConfig, { input: './global.css' });