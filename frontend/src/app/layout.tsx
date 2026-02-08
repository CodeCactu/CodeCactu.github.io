import "./normalize.css"
import "./layout.css"
import Image from "next/image"
import rescaleImage from "@lib/core/functions/rescaleImage"
import Link from "@lib/core/controls/Link"
import { StyleTheme } from "@fet/theme/themeCss"
import { cactuFont } from "@fet/theme/fonts"
import CactuShadyTrail from "@fet/dynamicBackgrounds/CactuShadyTrail"
import CactuBlinkingLines from "@fet/dynamicBackgrounds/CactuBlinkingLines"
import UserPanel from "@fet/auth/UserPanel"
import packageJson from "@/../package.json"
import classes from "./layout.module.css"
import cactuLogoImg from "./cactu-logo.png"
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

        <nav>
          <Link href="/" className={classes.navItem}>
            <Image {...rescaleImage( cactuLogoImg, 50, 50 )} alt="Cactu logo" />
          </Link>
        </nav>

        {props.children}

        <UserPanel className={classes.userPanel} />
        <CactuBlinkingLines className={classes.background} />
        <CactuShadyTrail className={classes.background} />
      </body>
    </html>
  )
}
