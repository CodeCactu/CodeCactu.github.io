import { config } from "@/config"

export async function GET() {
  return Response.json({ ping:`pong`, value:config.value })
}
