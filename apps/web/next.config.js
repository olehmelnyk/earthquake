// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // Enable full source maps in production
  productionBrowserSourceMaps: true,
  // Specify the source directory explicitly
  distDir: '.next',
  // Output standalone build for easier deployment
  output: 'standalone',
  // Use React strict mode
  reactStrictMode: true,
  // Handle workspace package imports
  transpilePackages: [
    '@earthquake/ui',
    '@earthquake/types',
    '@earthquake/graphql',
    '@earthquake/db'
  ],
  // Resolve packages from source in development
  experimental: {
    externalDir: true
  },
  // Custom webpack configuration to handle workspace packages
  webpack: (config, { isServer }) => {
    // Configure proper resolution for packages in development
    config.resolve.alias = {
      ...config.resolve.alias,
      '@earthquake/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@earthquake/types': path.resolve(__dirname, '../../packages/types/src'),
      '@earthquake/graphql': path.resolve(__dirname, '../../packages/graphql/src'),
      '@earthquake/db': path.resolve(__dirname, '../../packages/db/src')
    };

    return config;
  }
};

module.exports = withNx(nextConfig);
