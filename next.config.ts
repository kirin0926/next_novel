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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.novel-master.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
