import { createTheming } from "@lib/theming"

export const { createStylesHook, ThemeProvider } = createTheming({
  atoms: () => ({
    colors: {
      background: {
        main: `#212225`,
        text: `#fff`,
      },
      surface: {
        main: `#0004`,
        text: `#fff`,
      },

      green: {
        main: `#5da234`,
        main50: `#566d38`,
        text: `#fff`,
      },
      red: {
        main: `#b66141`,
        text: `#fff`,
      },
      purple: {
        main: `#6c52ec`,
        text: `#fff`,
      },
      blue: {
        main: `#5574ac`,
        text: `#fff`,
      },
      yellow: {
        main: `#e6bf4b`,
        text: `#fff`,
      },
      decoration: {
        main: `#444444`,
      },
    },

    spacing: {
      main: 25,
    },

    sizes: {
      border: {
        width: 5,
        radius: 10,
      },
    },

    timing: {
      hover: {
        main: `0.2s`,
      },
    },
  }),
  mixins: ({ atoms }) => ({
    surface: {
      padding: atoms.spacing.main,
      backgroundColor: atoms.colors.surface.main,
      color: atoms.colors.surface.text,
      borderRadius: atoms.sizes.border.radius,
    },
  }),
})
