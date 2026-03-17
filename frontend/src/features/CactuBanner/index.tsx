import Image from "next/image"
import cn from "@lib/core/functions/createClassName"
import noSign from "./svg/Banner-no_sign.svg"
import logo from "./svg/Banner-logo.svg"
import grass from "./svg/Banner-grass.svg"
import floating_face from "./svg/Banner-floating_face.svg"
import classes from "./CactuBanner.module.css"

export type CactuBannerProps = {
  className?: string
}

export default function CactuBanner({ className }:CactuBannerProps) {
  return (
    <section className={cn( classes.banner, className )}>
      <Image className={cn( classes.signet )} src={logo.src} width={294} height={345} alt="Cactu signet" priority />

      <Image className={cn( classes.singleSign, classes.floatingFace, classes.is1 )} src={floating_face.src} width={168} height={137} alt="Floating face" />
      <Image className={cn( classes.singleSign, classes.floatingFace, classes.is2 )} src={floating_face.src} width={168} height={137} alt="Floating face" />

      <Image className={cn( classes.singleSign, classes.grass, classes.is1 )} src={grass.src} width={100} height={45} alt="Grass" />
      <Image className={cn( classes.singleSign, classes.grass, classes.is2 )} src={grass.src} width={100} height={45} alt="Grass" />
      <Image className={cn( classes.singleSign, classes.grass, classes.is3 )} src={grass.src} width={100} height={45} alt="Grass" />

      <p className={classes.logotype}>cactu</p>

      <Image className={cn( classes.singleSign, classes.noSign )} src={noSign.src} width={100} height={66} alt="No sign" />
    </section>
  )
}
