// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');

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
  // Handle CSS imports from the UI package
  transpilePackages: ['@earthquake/ui'],
  // Add experimental features to resolve packages from source
  experimental: {
    externalDir: true
  }
};

module.exports = withNx(nextConfig);
