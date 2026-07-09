/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.byteplus.com" },
      { protocol: "https", hostname: "**.bytepluses.com" },
      { protocol: "https", hostname: "**.volccdn.com" },
    ],
  },
};

export default nextConfig;
