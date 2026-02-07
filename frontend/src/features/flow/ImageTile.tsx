import Image, { StaticImageData } from "next/image"
import { cn } from "@lib/core/functions"
import classes from "./ImageTile.module.css"

export type ImageTileProps = {
  className?: string
  img: StaticImageData
  imgHover: StaticImageData
}

export const imageTileHolderClassName = classes.imgTileHolder

export default function ImageTile({ className, img, imgHover }:ImageTileProps) {
  return (
    <div className={cn( classes.imgTile, className )}>
      <Image
        src={imgHover.src}
        width={imgHover.width}
        height={imgHover.height}
        blurDataURL={imgHover.blurDataURL}
        unoptimized
        alt=""
      />

      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        blurDataURL={img.blurDataURL}
        unoptimized
        alt=""
      />
    </div>
  )
}
