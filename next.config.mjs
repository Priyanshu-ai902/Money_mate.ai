/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['autogpt.net', 'randomuser.me'],

  },
  eslint: {
    ignoreDuringBuilds: true,
  },


  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    }
  }
};




export default nextConfig;
