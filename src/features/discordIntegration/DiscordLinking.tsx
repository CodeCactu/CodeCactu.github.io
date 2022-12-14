import { MdArrowForward } from 'react-icons/md'
import { useEffect, useState } from 'react'
import getWindow from "@lib/core/functions/getWindow"
import { createStylesHook } from "@fet/theming"
import Button from '@fet/controls/Button'
import backendHttp from '@fet/backendHttp'
import Text from "@fet/Text"
import CardLink from '@fet/CardLinks'
import { discordIntegrationStorageUserKey, discordStorage } from './discordStorage'

export type DiscordLinkingProps = {
}

export type User = typeof mockedUser

const MOCK = false

export default function DiscordLinking() {
  const [ classes, { atoms } ] = useStyles()
  const [ redirect, setRedirect ] = useState( `` )
  const href = getWindow()?.location.href ?? ``
  const code = href.match( /.*code=(\w+)/ )?.[ 1 ]
  const [ failure, setFailure ] = useState( false )
  const window = getWindow()

  const clearLocationQuery = () => window && (window.history.replaceState( {}, ``, location.href.match( /^(.*)\?/ )?.[ 1 ] ?? location.href ))

  useEffect( () => {
    if (!code || !window) return

    const { location } = window

    const storeUser = (user:User, sessionToken:string) => {
      discordStorage.set( discordIntegrationStorageUserKey, { sessionToken, user } )
      clearLocationQuery()
    }

    if (MOCK) return storeUser( mockedUser, `MOCK` )

    let mounted = true
    const body = { code, redirect:location.origin + `/jam` }

    backendHttp.post<{user: User; sessionToken: string}>( `/discord/integrate`, body ).then( ([ data ]) => {
      if (!mounted) return
      if (!data || !(`user` in data)) return setFailure( true )

      clearLocationQuery()
      storeUser( data.user, data.sessionToken )
    } )

    return () => { mounted = false }
  }, [ code ] )

  useEffect( () => { setRedirect( encodeURIComponent( window?.location.origin ?? `` ) + `/jam` ) }, [] )

  if (!code) {
    const authLinkHref = MOCK
      ? `?code=mock`
      : `https://discord.com/oauth2/authorize`
        + `?client_id=379234773408677888`
        + `&redirect_uri=${redirect}`
        + `&response_type=code`
        + `&scope=identify`

    return (
      <article className={classes.discordLinking}>
        <Text as="h1" body="Integracja z Discordem" />
        <CardLink href={authLinkHref} icon={MdArrowForward} color={atoms.colors.rest.green} body="Autoryzuj" />
      </article>
    )
  }

  if (failure) return (
    <article className={classes.discordLinking}>
      <Text as="h1" body="Niepowodzenie" />

      <Text>
        Możesz spróbować ponownie lub skontaktuj się z właściciwle serwisu,
        który najpewniej skopał temat
      </Text>

      <Button onClick={() => clearLocationQuery()} body="Odśwież stronę" />
    </article>
  )

  return (
    <article className={classes.discordLinking}>
      <Text as="h1" body="Przetwarzanie kodu zwrotnego" />
      <Text>
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
