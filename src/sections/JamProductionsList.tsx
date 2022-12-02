import { useEffect } from "react"
import http from "@lib/http"
import useArrayState from "@lib/core/hooks/useArrayState"
import Surface from "@fet/contentContainers/Surface"

export default function JamProductionList() {
  const [ list ] = useArrayState()

  useEffect( () => {
    http.get( `${process.env.GATSBY_API_SERVER_URL}` ).then( ([ data ]) => {
      console.log( data )
    } )
  }, [] )

  return (
    <Surface>
      {
        list.map( () => (
          <article>
            <img src="" alt="avatar" />
          </article>
        ) )
      }
    </Surface>
  )
}
