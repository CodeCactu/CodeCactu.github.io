import { MdArrowForward } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import http from '@lib/http'
import getWindow from "@lib/core/functions/getWindow"
import { createStylesHook } from "@fet/theming"
import Text from "@fet/Text"
import CardLink from '@fet/CardLinks'
import { getServerApiUrl } from '../../config'
import { discordIntegrationStorageSessionKey, discordIntegrationStorageUserKey } from './isIntegrated'

export type DiscordLinkingProps = {
}

export type User = typeof mockedUser

const MOCK = false

export default function DiscordLinking() {
  const [ classes, { atoms } ] = useStyles()
  const [ redirect, setRedirect ] = useState( `` )
  const href = getWindow()?.location.href ?? ``
  const code = href.match( /.*code=(\w+)/ )?.[ 1 ]

  useEffect( () => {
    if (!code) return

    const window = getWindow()

    if (!window) return

    const storeUser = (user:User, sessionToken:string) => {
      window.localStorage.setItem( discordIntegrationStorageUserKey, JSON.stringify( user ) )
      window.localStorage.setItem( discordIntegrationStorageSessionKey, sessionToken )
      navigate( `?` )
    }

    if (MOCK) return storeUser( mockedUser, `MOCK` )

    let mounted = true
    const body = { code, redirect:window.location.origin + `/jam` }
    console.log({ body })

    http.post<{user: User; sessionToken: string}>( `${getServerApiUrl()}/discord/integrate`, body ).then( ([ data ]) => {
      if (!mounted || !data || !(`user` in data)) {
        navigate( `/jam` )
        return
      }

      storeUser( data.user, data.sessionToken )
      window.location.reload()
    } )

    return () => { mounted = false }
  }, [ code ] )

  useEffect( () => {
    setRedirect( encodeURIComponent( getWindow()?.location.origin ?? `` ) + `/jam` )
  }, [] )


  // https://discord.com/oauth2/authorize?client_id=379234773408677888&redirect_uri=http%3A%2F%2Flocalhost%3A8000/jam/jam&response_type=code&scope=identify

  if (!code) {
    const authLinkHref = MOCK
      ? `?code=mock`
      : `https://discord.com/oauth2/authorize`
        + `?client_id=379234773408677888`
        + `&redirect_uri=${redirect}`
        + `&response_type=code`
        + `&scope=identify`

    console.log()

    return (
      <article className={classes.discordLinking}>
        <Text as="h1" body="Integracja z Discordem" />
        <CardLink href={authLinkHref} icon={MdArrowForward} color={atoms.colors.rest.green} body="Autoryzuj" />
      </article>
    )
  }


  return (
    <article className={classes.discordLinking}>
      <Text as="h1" body="Przetwarzanie kodu zwrotnego" />
      <Text as="p">
        Kod Twej integracji jest teraz przetwarzany po stronie serwera.
        W ciągu chwili powinieneś otrzymać informację o wyniku integracji
      </Text>
    </article>
  )
}

const useStyles = createStylesHook( ({ atoms, mixins }) => ({
  discordLinking: {
    width: atoms.sizes.columnWidth,
    ...mixins.surface,
  },
}) )

const mockedUser = {
  id: `263736841025355777`,
  username: `Evolveye`,
  avatar: `4857fe19978557e05628e28767dfda83`,
  avatar_decoration: null,
  discriminator: `7100`,
  public_flags: 256,
  flags: 256,
  banner: `12e1d85db33d3e46e3ecb4ae147ad19e`,
  banner_color: `#0558ff`,
  accent_color: 350463,
  locale: `pl`,
  mfa_enabled: false,
  premium_type: 2,
}
