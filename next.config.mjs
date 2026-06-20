/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   remotePatterns: [
  {
    protocol: 'https',
    hostname: '**', // Allows any HTTPS hostname (not recommended for production)
  },
],
  },
};

export default nextConfig;