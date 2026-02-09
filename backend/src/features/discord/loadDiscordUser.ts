import fetchDiscord from "./fetchDiscord"

export type DiscordUserAvatarDecoration = {
  asset: string
  expires_at: number
  sku_id: string
}

export type DiscordUser = {
  id: string
  username: string
  global_name: string
  discriminator: string
  avatar: null | string
  avatar_decoration_data: null | DiscordUserAvatarDecoration
  accent_color: number | null | string
  banner: null | string
  banner_color: null | string
  clan: null | unknown
  collectibles: null | unknown
  display_name_styles: null | unknown
  flags: number
  public_flags: number
  primary_guild: null | string
}

export default function loadDiscordUser( userId:string ) {
  return fetchDiscord<DiscordUser>( `/users/${userId}` )
}
