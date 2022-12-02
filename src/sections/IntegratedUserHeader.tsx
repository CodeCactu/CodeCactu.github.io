import { MdLogout } from "react-icons/md"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { createStylesHook } from "@fet/theming"
import Column from "@fet/flow/Column"
import { useIntegratedUserContext } from "@fet/discordIntegration/IntegratedUserContext"
import Surface from "@fet/contentContainers/Surface"
import Text from "@fet/Text"
import CardLink from "@fet/CardLinks"
import { getServerApiUrl } from "../config"

export default function IntegratedUserHeader() {
  const [ classes, { atoms } ] = useStyles()
  const { user } = useIntegratedUserContext()

  const uploadFile = async() => {
    const files:null | FileList = await new Promise( r => {
      const input = document.createElement( `input` )

      input.type = `file`
      input.accept = `.zip`
      input.click()
      input.addEventListener( `change`, () => r( input.files ) )
    } )

    const form = new FormData()
    if (files) form.append( `gameZip`, files[ 0 ] )

    const res = await fetch( `${getServerApiUrl()}/cactujam/games`, {
      method: `POST`,
      body: form,
    } ).then( r => r.json() )

    console.log( res )
  }

  return (
    <Surface className={classes.integrationUserHeader}>
      <img className={classes.avatar} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=${100}`} alt={`${user.username}'s avatar`} />

      <Column>
        <Text>{`${user.username}#${user.discriminator}`}</Text>
        <CardLink href="/" color={atoms.colors.rest.red} icon={MdLogout} body="Wyloguj się" />
      </Column>

      <Column>
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
  },
  avatar: {
    borderRadius: `50%`,
    border: `2px solid ${atoms.colors.rest.green}`,
    padding: 2,
  },
}) )
