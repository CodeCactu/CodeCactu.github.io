// import logoSvg from "@fet/MainLayout/logo/cactus.svg"
import Image from "@lib/core/flow/Image"
import grassBlockPng from "./grass-block.png"
import classes from "./TiledCactuLogo.module.css"
import React from "react"

export default function TiledCactuLogo() {
  const tileSize = 64

  const commonTileProps = {
    ...grassBlockPng,
    alt: ``,
  }

  return (
    <article className={classes.tilesCactuLogo}>
      {/* <Image src={logoSvg.src} alt="" /> */}

      <div className={classes.tiles} style={{ "--tileSize":`${tileSize}px` } as React.CSSProperties}>
        <Image {...commonTileProps} style={{ left:100 }} />
      </div>
    </article>
  )
}
