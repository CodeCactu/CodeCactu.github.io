import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createStore } from "@lib/stores"
import { getWindow } from "@lib/core/functions"
import Session, { SessionData } from "./session/Session"
import logAuth from "./logAuth"

export type AuthHookOptions = {
  required?: boolean
}

const [ useSessionStore, updateSessionStore ] = createStore<undefined | null | SessionData>( undefined )

export function useAuth( { required }:AuthHookOptions = {} ) {
  const router = useRouter()
  const [ session ] = useSessionStore()
  const [ loginLink, setLoginLink ] = useState<string>()

  useEffect( () => {
    setLoginLink( getDiscordIntegrationLink() ) // eslint-disable-line react-hooks/set-state-in-effect -- Intentional dealing with hydration mssmatch

    if (Session.checkIsInitialised()) return

    logAuth( `Session loading...` )

    const code = new URL( location.href ).searchParams.get( `code` )

    const handleSessionData = (data:null | SessionData) => {
      if (!data) {
        logAuth( `Clearing incorrect session data` )
        updateSessionStore( null )
        return Session.delete()
      }

      logAuth( `Logged in. Expiration in ${Session.getExpirationDate()!}` )
      updateSessionStore( data )

      Session.runExpirationTimer( () => {
        updateSessionStore( null )
        logAuth( `Sessionexpired ` )
      } )
    }

    if (code) {
      Session.create( code ).then( data => {
        handleSessionData( data )
        router.push( `/` )
      } )
    } else if (Session.checkExistance()) {
      Session.get().then( handleSessionData )
    } else {
      logAuth( `No available session` )
      updateSessionStore( null )
    }
  }, [ router ] )

  useEffect( () => {
    if (session === null && required) router.push( `/` )
  }, [ router, session, required ] )

  return [ session && session.user, loginLink ] as const
}

function getDiscordIntegrationLink() {
  return `https://discord.com/oauth2/authorize`
    + `?client_id=379234773408677888`
    + `&redirect_uri=${encodeURIComponent( getWindow()?.location.origin ?? `` )}`
    + `&response_type=code`
    + `&scope=identify`
    // + `&prompt=none`
}
