import { ReactNode, useEffect, useState } from "react"
import cn from "@lib/theming/createClassName"
import getWindow from "@lib/core/functions/getWindow"
import { createStylesHook } from "@fet/theming"

export type NavItemProps = {
  children: ReactNode
  href: string
}

export default function NavLink({ children, href }) {
  const [ classes ] = useStyles()
  const [ isCurrentHref, setIsCurrentHref ] = useState( false )

  useEffect( () => {
    if (![ href, href + `/` ].includes( getWindow()?.location.pathname )) return

    setIsCurrentHref( true )
  }, [] )

  return (
    <a className={cn( classes.navLink, isCurrentHref && classes.isActive )} href={href}>
      <div className={classes.content}>
        {children}
      </div>
    </a>
  )
}

const useStyles = createStylesHook({
  navLink: {
    position: `relative`,
    display: `block`,
    padding: 10,

    "&::after": {
      content: `""`,
      position: `absolute`,
      left: -5,
      top: `50%`,
      translate: `0 -50%`,
      display: `block`,
      width: 4,
      height: 4,
      backgroundColor: `#fff`,
      borderRadius: `15px`,
      transition: `left 0.05s`,
    },

    "&:hover::after, &$isActive::after": {
      left: 2,
    },

    "&$isActive::after": {
      height: 20,
    },

    "&:not( $isActive ):hover $content": {
      borderRadius: 20,
    },
  },
  content: {
    borderRadius: `50%`,
    overflow: `hidden`,
    transition: `border-radius 0.1s`,
  },

  isActive: {
    "& $content": {
      borderRadius: 10,
    },
  },
})
