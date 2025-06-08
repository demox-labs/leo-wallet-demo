/** @type {import('next').NextConfig} */

const webpack = require('webpack');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const path = require('path');

module.exports = {
  ...withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV === 'development',
      runtimeCaching,
      maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
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

      const isServer = options.isServer;

      if (!isServer) {
        config.plugins.push(
          new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
          }),
          new webpack.DefinePlugin({
            'process.env': JSON.stringify({
              NEXT_PUBLIC_SECONDS_PER_BLOCK:
                process.env.NEXT_PUBLIC_SECONDS_PER_BLOCK,
              NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
              NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
              NEXT_PUBLIC_PONDO_CORE_PROTOCOL_ID:
                process.env.NEXT_PUBLIC_PONDO_CORE_PROTOCOL_ID,
              NEXT_PUBLIC_MULTI_TOKEN_SUPPORT_PROGRAM_ID:
                process.env.NEXT_PUBLIC_MULTI_TOKEN_SUPPORT_PROGRAM_ID,
              NEXT_PUBLIC_PONDO_WITHDRAW_FEE:
                process.env.NEXT_PUBLIC_PONDO_WITHDRAW_FEE,
            }),
          })
        );
      }
      const experiments = config.experiments || {};
      Object.assign(experiments, {
        asyncWebAssembly: true,
        syncWebAssembly: true,
        topLevelAwait: true,
      });
      config.experiments = experiments;
      const alias = config.resolve.alias || {};
      Object.assign(alias, {
        react$: require.resolve('react'),
      });
      config.resolve.alias = alias;

      config.resolve.symlinks = true;
      config.resolve.modules.push(path.resolve('./node_modules'));

      return config;
    },
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
};
