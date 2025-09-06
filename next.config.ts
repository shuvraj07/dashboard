import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "old.bizshala.com",
      "i.pravatar.cc",
      "picsum.photos",
      "i.ibb.co",
      "lh3.googleusercontent.com",
    ], // 👈 add this line
  },
  /* config options here */
};

export default nextConfig;
