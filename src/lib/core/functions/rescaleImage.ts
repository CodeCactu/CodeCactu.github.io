import { StaticImageData } from "next/image"

export default function rescaleImage( img:StaticImageData, maxWidth:number, maxHeight:number ) {
  const ratioWidth = maxWidth / img.width
  const ratioHeight = maxHeight / img.height
  const ratio = Math.min( ratioWidth, ratioHeight )

  return {
    src: img.src,
    width: img.width * ratio,
    height: img.height * ratio,
  }
}
