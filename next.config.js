/** @type {import('next').NextConfig} */

const webpack = require('webpack');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
  },
  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
  webpack5: true,
  webpack: (config, options) => {
    config.ignoreWarnings = [/Failed to parse source map/];
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      stream: require.resolve('stream-browserify'),
      fs: require.resolve('browserify-fs'),
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ]);
    return config;
  },
});
