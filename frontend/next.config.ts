import type { NextConfig } from "next"

const nextConfig:NextConfig = {
  output: `standalone`,
  images: {
    remotePatterns: [
      { hostname:`placehold.co` },
      { hostname:`cdn.discordapp.com` },
    ],
  },
}

export default nextConfig
