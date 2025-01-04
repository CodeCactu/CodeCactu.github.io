import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [ { hostname:`placehold.co` } ],
  },
}

export default nextConfig
