"use client"

import rescaleImage from "@lib/core/functions/rescaleImage"
import { colors } from "@fet/theme"
import Surface from "@fet/flow/Surface"
import ImageTile, { imageTileHolderClassName } from "@fet/flow/ImageTile"
import { useAuth } from "@fet/auth/useAuth"
import classes from "./page.module.css"
import tileGrassFlowers from "./grass-flowers-block.png"
import tileGrass from "./grass-block.png"
import cactus from "./cactus.png"
import cactusBloomed from "./cactus-bloomed-0000.png"

export default function Nav() {
  const [ user ] = useAuth()

  return (
    <Surface dataset={{ bgrEffect:`luminate ${colors.primary}` }} href={!!user && `/cactujam`} className={imageTileHolderClassName}>
      <ImageTile
        className={classes.imgTileGrass}
        img={rescaleImage( tileGrass, 80, 65 )}
        imgHover={rescaleImage( tileGrassFlowers, 80, 65 )}
      />

      <ImageTile
        className={classes.imgTileCactus}
        img={rescaleImage( cactus, 75, 95 )}
        imgHover={rescaleImage( cactusBloomed, 75, 95 )}
      />

      CactuJam
    </Surface>
  )
}
