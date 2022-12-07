import { MdLogout } from "react-icons/md"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { navigate } from "gatsby"
import getWindow from "@lib/core/functions/getWindow"
import { createStylesHook } from "@fet/theming"
import Column from "@fet/flow/Column"
import { discordIntegrationStorageSessionKey, discordIntegrationStorageUserKey } from "@fet/discordIntegration/isIntegrated"
import getSessionToken from "@fet/discordIntegration/getSessionToken"
import { useIntegratedUserContext } from "@fet/discordIntegration/IntegratedUserContext"
import DiscordAvatar from "@fet/discordIntegration/DiscordAvatar"
import Surface from "@fet/contentContainers/Surface"
import Text from "@fet/Text"
import CardLink from "@fet/CardLinks"
import { getServerApiUrl } from "../config"

export default function IntegratedUserHeader() {
  const [ classes, { atoms } ] = useStyles()
  const { user } = useIntegratedUserContext()

  const logout = async() => {
    const storage = getWindow()?.localStorage
    const sessionToken = getSessionToken()

    if (!storage || !sessionToken) return

    storage.removeItem( discordIntegrationStorageUserKey )
    storage.removeItem( discordIntegrationStorageSessionKey )

    await fetch( `${getServerApiUrl()}/discord/integrate`, {
      method: `DELETE`,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    } )

    navigate( `/jam` )
  }

  const uploadFile = async() => {
    const files:null | FileList = await new Promise( r => {
      const input = document.createElement( `input` )

      input.type = `file`
      input.accept = `.zip`
      input.click()
      input.addEventListener( `change`, () => r( input.files ) )
    } )

    const form = new FormData()
    const sessionToken = getSessionToken()

    if (files) form.append( `gameZip`, files[ 0 ] )
    if (sessionToken) form.append( `sessionToken`, sessionToken )

    const res = await fetch( `${getServerApiUrl()}/cactujam/games`, {
      method: `POST`,
      body: form,
    } ).then( r => r.json() )

    if (res.success) getWindow()?.location.reload()
  }

  return !user ? null : (
    <Surface className={classes.integrationUserHeader}>
      <DiscordAvatar className={classes.avatar} userId={user.id} avatarId={user.avatar} username={user.username} />

      <Column>
        <Text>{`${user.username}#${user.discriminator}`}</Text>
        <CardLink onClick={logout} color={atoms.colors.rest.red} icon={MdLogout} body="Wyloguj się" />
      </Column>

      <Column className={classes.upload}>
        <Text>Załaduj plik ze swoją produkcją (zip)</Text>
        <CardLink onClick={uploadFile} color={atoms.colors.rest.green} icon={AiOutlineCloudUpload} body="Załaduj plik" />
      </Column>
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  integrationUserHeader: {
    display: `flex`,
    gap: atoms.spacing.main,
    alignItems: `center`,
    width: atoms.sizes.columnWidth,

    [ atoms.breakpoints.bigMobile.mediaQueryMax ]: {
      flexDirection: `column`,
      textAlign: `center`,
    },
  },
  avatar: {
    borderRadius: `50%`,
    border: `2px solid ${atoms.colors.rest.green}`,
    padding: 2,
  },
  upload: {
    [ atoms.breakpoints.bigMobile.mediaQueryMax ]: {
      display: `none`,
    },
  },
}) )
