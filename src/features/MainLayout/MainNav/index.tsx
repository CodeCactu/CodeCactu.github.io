import { cn } from "@lib/theming"
import { createStylesHook } from "@fet/theming"

export type MainNavProps = {
  className?: string
}

export default function MainNav({ className }:MainNavProps) {
  const [ classes ] = useStyles()

  return (
    <nav className={cn( classes.mainNav, className )}>
      <ol className={classes.items}>
        <li className={classes.item}>
          <a href="#">CactuJam</a>
        </li>
      </ol>
    </nav>
  )
}

const useStyles = createStylesHook( ({ atoms, mixins }) => ({
  "@global": {
    "#__next": {
      fontFamily: `sans-serif`,
    },
  },

  mainNav: {
    padding: atoms.spacing.main,
    width: 300,
  },

  items: {
    padding: 0,
    margin: 0,
    listStyle: `none`,
  },

  item: {
    "& > *": {
      display: `block`,
      position: `relative`,
      ...mixins.surface,
      width: `calc( 100% - ${atoms.sizes.border.width / 2}px )`,
      textDecoration: `none`,
      overflow: `hidden`,
      paddingLeft: atoms.spacing.main + atoms.sizes.border.width / 2,
      transitionDuration: atoms.timing.hover.main,
      transitionProperty: `width, color, padding-left`,
      color: atoms.colors.decoration.main,
      fontWeight: `bold`,

      "&::before": {
        content: `""`,
        position: `absolute`,
        left: 0,
        top: 0,
        height: `100%`,
        borderLeft: `solid ${atoms.colors.green.main}`,
        borderLeftWidth: atoms.sizes.border.width / 2,
        transitionDuration: atoms.timing.hover.main,
        transitionProperty: `border-left-width`,
      },

      "&:hover": {
        width: `100%`,
        color: atoms.colors.yellow.main,
        paddingLeft: atoms.spacing.main + atoms.sizes.border.width,
      },

      "&:hover::before": {
        borderLeftWidth: atoms.sizes.border.width,
      },
    },
  },
}) )
