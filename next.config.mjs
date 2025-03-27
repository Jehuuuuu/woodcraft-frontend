/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'tripo-data.cdn.bcebos.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
    }
export default nextConfig;