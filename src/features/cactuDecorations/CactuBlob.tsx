import { ReactNode } from "react"
import { cn } from "@lib/theming"
import { createStylesHook } from "@fet/theming"

export type CactuBlobProps = {
  children: ReactNode
  className?: string
}

export default function CactuBlob({ children, className }:CactuBlobProps) {
  const [ classes ] = useStyles()

  return (
    <div className={classes.cactuBlob}>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

const useStyles = createStylesHook( ({ atoms }) => {
  return {
    "@keyframes rotate": {
      to: {
        transform: `rotate( 360deg )`,
      },
    },

    cactuBlob: {
      position: `relative`,
      width: 500,
      height: 200,
      margin: atoms.spacing.main,
      padding: atoms.spacing.main / 2,
      overflow: `hidden`,
      borderRadius: atoms.spacing.main * 1.25,

      color: atoms.colors.background.text,

      "&::before, &::after": {
        content: `""`,
        position: `absolute`,
        left: 0,
        top: `50%`,
        width: `100%`,
        translate: `0 -50%`,
        rotate: `45deg`,
        aspectRatio: 1,
        backgroundImage: `
          conic-gradient(
            from 0deg,
            ${atoms.colors.green.main},
            ${atoms.colors.purple.main},
            ${atoms.colors.green.main}
          )
        `,
        animation: `$rotate 2s linear infinite`,
      },

      "&::after": {
        filter: `blur( 30px )`,
      },

      "& > div": {
        position: `relative`,
        padding: atoms.spacing.main / 2,
        height: `100%`,
        backgroundColor: atoms.colors.background.main,
        borderRadius: atoms.spacing.main,
        zIndex: 1,
      },
    },
  }
} )
