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
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '8000',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'woodcraft-backend.onrender.com',
            port: '5432',
            pathname: '/**',
          },
        ],
        domains: [
          'tripo-data.cdn.bcebos.com',
          'localhost',
          'tripo-data.rg1.data.tripo3d.com',
          'woodcraft-backend.onrender.com',
        ]
      },
    }
export default nextConfig;