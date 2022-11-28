import { createTheming } from "@lib/theming"

export const { createStylesHook, themeConfig } = createTheming({
  atoms: () => ({
    colors: {
      rest: {
        green: `#5da234`,
      },
      background: {
        dark: `#202022`,
        light: `#22232a`,
        main: `#212226`,
        text: `#eaeaea`,
      },
      surface: {
        main: `#05051055`,
        text: `#eaeaea`,
      },
    },
  }),
  mixins: ({ atoms }) => ({
    surface: {
      padding: 10,
      backgroundColor: atoms.colors.surface.main,
      color: atoms.colors.surface.text,
    },
  }),
})
