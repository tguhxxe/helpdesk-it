const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  // Keep development compilation separate from production builds.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  poweredByHeader: false,
  reactStrictMode: true,
});
