module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './src',
            '@app': './app',
            '@components': './src/components',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@queries': './src/queries',
            '@stores': './src/stores',
            '@types': './src/types',
            '@theme': './src/theme',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
