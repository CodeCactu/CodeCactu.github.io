import { createStylesHook } from "@fet/theming"

export default function NavSeparator() {
  const [ classes ] = useStyles()

  return (
    <hr className={classes.navSeparator} />
  )
}

const useStyles = createStylesHook({
  navSeparator: {
    width: `50%`,
  },
})
