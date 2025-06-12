const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;
module.exports = config;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// const config = {
//     resetCache: true
// };

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
