import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createStore } from "@lib/stores"
import { getWindow } from "@lib/core/functions"
import Session, { SessionData } from "./session/Session"
import logAuth from "./logAuth"

const [ useSessionStore, updateSessionStore ] = createStore<undefined | null | SessionData>( undefined )

export function useAuth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ session ] = useSessionStore()
  const [ loginLink, setLoginLink ] = useState( `` )

  useEffect( () => {
    if (Session.checkIsInitialised()) return

    logAuth( `Session loading...` )

    const code = searchParams.get( `code` )

    setLoginLink( getDiscordIntegrationLink() ) // eslint-disable-line react-hooks/set-state-in-effect -- it is safe operation, not an infinite effect loop

    const handleSessionData = (data:null | SessionData) => {
      if (!data) {
        logAuth( `Clearing incorrect session data` )
        return Session.delete()
      }

      logAuth( `Logged in. Expiration in ${Session.getExpirationDate()!}` )
      updateSessionStore( data )

      Session.runExpirationTimer( () => {
        updateSessionStore( null )
        logAuth( `Session expired` )
      } )
    }

    if (Session.checkExistance()) {
      Session.get().then( handleSessionData )
    } else if (code) {
      Session.create( code ).then( data => {
        handleSessionData( data )
        router.push( `/` )
      } )
    } else {
      logAuth( `No available session` )
      updateSessionStore( null )
    }
  }, [ router, searchParams ] )

  return [ session && session.user, loginLink ] as const
}

function getDiscordIntegrationLink() {
  return `https://discord.com/oauth2/authorize`
    + `?client_id=379234773408677888`
    + `&redirect_uri=${encodeURIComponent( getWindow()?.location.origin ?? `` )}`
    + `&response_type=code`
    + `&scope=identify`
    + `&prompt=none`
}
