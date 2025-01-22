/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api2/:path*",
        destination: "http://20.198.16.49:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
