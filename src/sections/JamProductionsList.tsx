import { useEffect } from "react"
import cn from "@lib/theming/createClassName"
import http from "@lib/http"
import useArrayState from "@lib/core/hooks/useArrayState"
import { createStylesHook } from "@fet/theming"
import { useRowStyles } from "@fet/flow/Row"
import { User } from "@fet/discordIntegration/DiscordLinking"
import DiscordAvatar from "@fet/discordIntegration/DiscordAvatar"
import Button from "@fet/controls/Button"
import Surface from "@fet/contentContainers/Surface"
import Text from "@fet/Text"
import { getServerApiUrl, getServerUrl } from "../config"

export type GameItem = {
  filename: string
  user: User
}

export default function JamProductionList() {
  const [ list, { push, clear } ] = useArrayState<GameItem>()
  const [ classes ] = useStyles()
  const [ rowClasses ] = useRowStyles()

  const download = filename => {
    const anchor = document.createElement( `a` )
    anchor.href = `${getServerUrl()}/cactujam/games/${filename}`
    anchor.download = ``
    anchor.click()
  }

  useEffect( () => {
    http.get( `${getServerApiUrl()}/cactujam/games` ).then( ([ data ]:any) => {
      if (!data?.games) return

      console.log( data )

      clear()
      push( ...data.games )
    } )
  }, [] )

  return (
    <Surface className={classes.jamProductionsList}>
      {
        list.map( g => (
          <article key={g.filename} className={cn( rowClasses.row, rowClasses.isSpaced, rowClasses.isJustifiedSpaceBetween )}>
            <DiscordAvatar className={classes.avatar} userId={g.user.id} avatarId={g.user.avatar} username={g.user.username} />

            <Text>Praca użytkownika {g.user.username}</Text>

            <Button variant="contained" onClick={() => download( g.filename )}>Pobierz</Button>
          </article>
        ) )
      }
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  jamProductionsList: {
    width: 600,
    marginTop: atoms.spacing.main,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: `50%`,
  },
}) )
