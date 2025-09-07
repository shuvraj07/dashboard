/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public", // output folder for service worker
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "old.bizshala.com",
      "i.pravatar.cc",
      "picsum.photos",
      "i.ibb.co",
      "lh3.googleusercontent.com",
    ],
  },
  // other Next.js config options
};

module.exports = withPWA(nextConfig);
