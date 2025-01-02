import noSign from "./svg/Banner-no_sign.svg"
import logo from "./svg/Banner-logo.svg"
import grass from "./svg/Banner-grass.svg"
import cactu from "./svg/Cactu.svg"
import floating_face from "./svg/Banner-floating_face.svg"
import Image from "@lib/core/flow/Image"
import cn from "@lib/core/functions/createClassName"
import classes from "./CactuBanner.module.css"

export default function CactuBanner() {
  return (
    <section className={classes.banner}>
      {/* <Image className={cn( classes.signet )} src={logo.src} alt="Cactu signet" />

      <Image className={cn( classes.singleSign, classes.floatingFace, classes.is1 )} src={floating_face.src} alt="Floating face" />
      <Image className={cn( classes.singleSign, classes.floatingFace, classes.is2 )} src={floating_face.src} alt="Floating face" />

      <Image className={cn( classes.singleSign, classes.grass, classes.is1 )} src={grass.src} alt="Grass" />
      <Image className={cn( classes.singleSign, classes.grass, classes.is2 )} src={grass.src} alt="Grass" />
      <Image className={cn( classes.singleSign, classes.grass, classes.is3 )} src={grass.src} alt="Grass" />

      <Image className={cn( classes.singleSign, classes.noSign )} src={noSign.src} alt="No sign" /> */}

      <Image width={35 * 15} className={cn( classes.cactu )} src={cactu.src} alt="Cactu" />
    </section>
  )
}
