import "./normalize.css"
import "./layout.css"
import { StyleTheme } from "@fet/theme/themeCss"
import { cactuFont } from "@fet/theme/fonts"
import CactuShadyTrail from "@fet/dynamicBackgrounds/CactuShadyTrail"
import CactuBlinkingLines from "@fet/dynamicBackgrounds/CactuBlinkingLines"
import UserPanel from "@fet/auth/UserPanel"
import packageJson from "@/../package.json"
import classes from "./layout.module.css"
import AppMetaLogger from "./AppMetaLogger"

export default function RootLayout( props:LayoutProps<`/`> ) {
  return (
    <html lang="pl" className={cactuFont.variable}>
      <head>
        <StyleTheme />
      </head>

      <body>
        <AppMetaLogger
          logEntries={
            [
              [ `App version`, packageJson.version ],
            ]
          }
        />

        {props.children}

        <UserPanel className={classes.userPanel} />
        <CactuBlinkingLines className={classes.background} />
        <CactuShadyTrail className={classes.background} />
      </body>
    </html>
  )
}
