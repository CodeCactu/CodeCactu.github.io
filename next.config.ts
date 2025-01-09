import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [ { hostname:`placehold.co` }, { hostname:`cdn.discordapp.com` } ],
  },
}

export default nextConfig
