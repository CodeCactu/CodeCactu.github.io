import { createTheming } from "@lib/theming"

export const { createStylesHook, ThemeProvider } = createTheming({
  atoms: () => ({
    colors: {
      background: {
        main: `#212225`,
        text: `#fff`,
      },

      red: {
        main: `#b66141`,
        text: `#fff`,
      },
      green: {
        main: `#7b9a52`,
        main50: `#566d38`,
        text: `#fff`,
      },
      blue: {
        main: `#5574ac`,
        text: `#fff`,
      },
      purple: {
        main: `#6c52ec`,
        text: `#fff`,
      },
    },

    spacing: {
      main: 25,
    },
  }),
})
