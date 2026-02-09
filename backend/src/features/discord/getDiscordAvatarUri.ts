export default function getDiscordAvatarUri( userId:string, avatarHash:null | string, size:32 | 64 | 128 = 64 ) {
  if (!avatarHash) return null
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=${size}`
}
