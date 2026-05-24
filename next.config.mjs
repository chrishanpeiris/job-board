/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    // Server Actions are stable in Next.js 14 — no flag needed
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
};
export default config;
