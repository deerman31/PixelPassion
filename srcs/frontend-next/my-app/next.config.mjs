/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend-golang:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
