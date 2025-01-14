import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'img.novel-master.com',
  //     },
  //   ],
  // },
  images: {
    domains: ['img.novel-master.com'],
  },
};

export default nextConfig;
