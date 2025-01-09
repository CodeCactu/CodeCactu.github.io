import getWindow from "@lib/core/functions/getWindow"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { BACKEND_ORIGIN } from "../../config"

const sessionKey = `sessionToken`

export type User = {
  id: string
  accentColor?: string
  displayName: string
  avatarHash: string
}

let loadeduser:null | User = null
export default function useDiscordLinking() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ integrationLink, setIntegrationLink ] = useState( `` )
  const [ discordUser, setDiscordUser ] = useState<null | false | User>( null )
  const code = searchParams.get( `code` )

  useEffect( () => {
    const savedSessionToken = getSessionToken()
    const handleUser = (user:false | User) => {
      setDiscordUser( user )
      if (user) loadeduser = user
      else logout()

    }

    setIntegrationLink( getDiscordIntegrationLink() )

    if (savedSessionToken) {
      loadSession( savedSessionToken ).then( handleUser )
    } else if (code) {
      loadDiscordUser( code ).then( user => {
        handleUser( user )
        router.push( `/` )
      } )
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

      return data.user as User
    } )
}

export function getSessionToken() {
  return localStorage.getItem( sessionKey )
}

export function logout() {
  return localStorage.removeItem( sessionKey )
}

export function getCurrentUser() {
  return loadeduser ? structuredClone( loadeduser ) : null
}

export function getAuthHeader() {
  return { Authorization:`Bearer ${getSessionToken()}` }
}
