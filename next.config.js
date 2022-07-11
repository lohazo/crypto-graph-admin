/** @type {import('next').NextConfig} */
module.exports = {
  concurrentFeatures: false,
  serverComponents: false,
  reactRoot: false,
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
