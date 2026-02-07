"use client"

import Image from "next/image"
import rescaleImage from "@lib/core/functions/rescaleImage"
import { cn } from "@lib/core/functions"
import { useAuth } from "./useAuth"
import defaultAvatar from "./default-avatar.png"
import classes from "./UserPanel.module.css"

export type UserPanelProps = {
  className?: string
}

export default function UserPanel({ className }:UserPanelProps) {
  const [ session, loginLink ] = useAuth()

  if (session === undefined) return null
  if (session === null) return (
    <a className={cn( classes.userPanel, className )} href={loginLink}>
      <Image {...rescaleImage( defaultAvatar, 50, 50 )} className="pixelart" alt="User avatar" />

      <div>
        Zaloguj się
      </div>
    </a>
  )

  return (
    <a className={cn( classes.userPanel, className )} href={loginLink}>
      <Image src={`https://cdn.discordapp.com/avatars/${session.discordId}/${session.avatarHash}.png?size=64`} width={50} height={50} className="pixelart" alt="User avatar" />

      <div>
        Zaloguj się
      </div>
    </a>
  )
}
