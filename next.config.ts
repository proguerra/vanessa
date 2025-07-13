/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-s.acuityscheduling.com',
        port: '',
        pathname: '/**', // Allows any path under this hostname
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // For placeholder images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com', // For other static images used
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google user profile pictures in reviews
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
