import { createStylesHook } from "@fet/theming"
import CactuBanner from "@fet/cactuImages/CactuBanner"

export default function HomeScreen() {
  const [ classes ] = useStyles()

  return (
    <div className={classes.bannerScreen}>
      <CactuBanner />
    </div>
  )
}

const useStyles = createStylesHook({
  bannerScreen: {
    display: `flex`,
    height: `100vh`,
    justifyContent: `center`,
    alignItems: `center`,
  },
  nav: {
    position: `absolute`,
    left: 10,
    bottom: 10,
  },
})
