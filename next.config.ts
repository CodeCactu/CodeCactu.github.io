import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: `standalone`,
  /* config options here */
  images: {
    remotePatterns: [ { hostname:`placehold.co` }, { hostname:`cdn.discordapp.com` } ],
  },
}

export default nextConfig
