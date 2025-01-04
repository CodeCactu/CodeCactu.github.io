import getWindow from "@lib/core/functions/getWindow"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const BACKEND_ORIGIN = `http://localhost:3001`

const sessionKey = `sessionToken`

export type User = {
  id: string
  accentColor: string
  displayName: string
  avatarHref: string
}

export default function useDiscordLinking() {
  const searchParams = useSearchParams()
  const [ integrationLink, setIntegrationLink ] = useState( `` )
  const [ discordUser, setDiscordUser ] = useState<null | false | User>( null )
  const code = searchParams.get( `code` )

  useEffect( () => {
    const savedSessionToken = localStorage.getItem( sessionKey )

    setIntegrationLink( getDiscordIntegrationLink() )

    if (savedSessionToken) {
      loadSession( savedSessionToken ).then( setDiscordUser )
    } else if (code) {
      loadDiscordUser( code ).then( setDiscordUser )
    } else setDiscordUser( false )
  }, [] )

  const discordAuth = {
    integrationLink,
    discordUser,
  }

  return discordAuth
}

function getDiscordIntegrationLink() {
  const window = getWindow()
  return `https://discord.com/oauth2/authorize`
    + `?client_id=379234773408677888`
    + `&redirect_uri=${encodeURIComponent( window?.location.origin ?? `` )}`
    + `&response_type=code`
    + `&scope=identify`
}

let pendingDiscordUser:null | Promise<User> = null
async function loadDiscordUser( code:string ) {
  if (pendingDiscordUser) return pendingDiscordUser

  pendingDiscordUser = fetch( `${BACKEND_ORIGIN}/api/discordAuth/${code}` )
    .then( res => res.json() )
    .then( data => {
      if (!data || data.message) throw data
      return data
    } )
    .then( data => {
      const { user, token } = data
      localStorage.setItem( sessionKey, token )
      return user
    } )
    .catch( err => ({ err }) )
    .finally( () => (pendingDiscordUser = null) )

  return pendingDiscordUser
}

function loadSession( token:string ) {
  return fetch( `${BACKEND_ORIGIN}/api/discordFromToken/${token}` )
    .then( res => res.json() )
    .then( data => {
      if (data.message) {
        localStorage.removeItem( `token` )
        return false
      }

      return data.user
    } )
}
