"use client"

import Link from "@lib/core/controls/Link"
import useDiscordLinking from "./useDiscordLinking"

export default function UserMenu() {
  const discordAuth = useDiscordLinking()

  if (discordAuth.discordUser === null) return <i />

  if (discordAuth.discordUser) return (
    <>
      Hello {discordAuth.discordUser.displayName}
    </>
  )

  return (
    <>
      <Link href={discordAuth.integrationLink}>link to discord</Link>
    </>
  )
}
