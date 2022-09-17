import { StaticImage } from "gatsby-plugin-image"
import { createStylesHook } from "@fet/theming"
import NavSeparator from "./NavSeparator"
import NavLinkExtension from "./NavLinkExtension"
import NavLink from "./NavLink"

export type NavProps = {}

const imagesFolderPath = `../../../../images`

export default function Nav() {
  const [ classes ] = useStyles()

  return (
    <nav className={classes.nav}>
      <NavLink href="/">
        <StaticImage src={`${imagesFolderPath}/cactu-logo.png`} alt="Cactu logo" />
      </NavLink>

      <NavSeparator />

      <NavLink href="/jam">
        <StaticImage src={`${imagesFolderPath}/cactu-jam.png`} alt="CactuJam temporary icon" />

        <NavLinkExtension body="CactuJam" />
      </NavLink>
    </nav>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  nav: {
    width: 75,
    backgroundColor: atoms.colors.surface.main,
    backdropFilter: `blur( 2px )`,
  },
}) )
