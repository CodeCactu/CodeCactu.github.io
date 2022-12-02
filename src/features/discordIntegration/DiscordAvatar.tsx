export type DiscordAvatarProps = {
  className?: string
  username: string
  userId: string
  avatarId: string
}

export default function DiscordAvatar({ className, username, userId, avatarId }:DiscordAvatarProps) {
  return <img className={className} src={`https://cdn.discordapp.com/avatars/${userId}/${avatarId}.webp?size=100`} alt={`${username}'s avatar`} />
}
