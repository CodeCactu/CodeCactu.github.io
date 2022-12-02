import { MdLogout } from "react-icons/md"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { createStylesHook } from "@fet/theming"
import { useIntegratedUserContext } from "@fet/discordIntegration/IntegratedUserContext"
import Surface from "@fet/contentContainers/Surface"
import CardLink from "@fet/CardLinks"

export default function IntegratedUserHeader() {
  const [ classes, { atoms } ] = useStyles()
  const { user } = useIntegratedUserContext()

  return (
    <Surface className={classes.row}>
      <img className={classes.avatar} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=${100}`} alt={`${user.username}'s avatar`} />

      <div>
        {`${user.username}#${user.discriminator}`}
        <CardLink to="/" color={atoms.colors.rest.red} icon={MdLogout} body="Wyloguj się" />
      </div>

      <div>
        Załaduj plik ze swoją produkcją (zip)
        <CardLink to="/" color={atoms.colors.rest.green} icon={AiOutlineCloudUpload} body="Załaduj plik" />
      </div>
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  row: {
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
