import { createStylesHook } from "@fet/theming"
import noSign from "./svg/Banner-no_sign.svg"
import logo from "./svg/Banner-logo.svg"
import grass from "./svg/Banner-grass.svg"
import floating_face from "./svg/Banner-floating_face.svg"

export default function CactuBanner() {
  const [ classes ] = useStyles()

  return (
    <section className={classes.banner}>
      <img className={classes.signet} src={logo} alt="Cactu signet" />

      <img className={`${classes.singleSign} ${classes.floatingFace} is-1`} src={floating_face} alt="Floating face" />
      <img className={`${classes.singleSign} ${classes.floatingFace} is-2`} src={floating_face} alt="Floating face" />

      <img className={`${classes.singleSign} ${classes.grass} is-1`} src={grass} alt="Grass" />
      <img className={`${classes.singleSign} ${classes.grass} is-2`} src={grass} alt="Grass" />
      <img className={`${classes.singleSign} ${classes.grass} is-3`} src={grass} alt="Grass" />

      <img className={`${classes.singleSign} ${classes.noSign}`} src={noSign} alt="No sign" />

      <span className={classes.logotype}>cacTu</span>
    </section>
  )
}

const useStyles = createStylesHook({
  banner: {
    position: `relative`,
    display: `flex`,
    height: `max-content`,
    justifyContent: `center`,
    alignItems: `center`,
  },
  singleSign: {
    position: `absolute`,
    width: `100px`,
  },
  signet: {
    zIndex: 10,
  },
  logotype: {
    position: `relative`,
    fontSize: `190px`,
    left: `unset`,
    top: `unset`,
    transform: `unset`,
    alignSelf: `flex-end`,
    lineHeight: `118px`,
    letterSpacing: `20px`,
    fontFamily: `Coconut`,
    color: `#5da234`,
  },
  floatingFace: {
    width: `170px`,

    "&.is-1": {
      top: `70px`,
      left: `410px`,
    },

    "&.is-2": {
      top: `70px`,
      left: `693px`,
    },
  },
  grass: {
    "&.is-1": {
      top: `calc( 100% - 120px )`,
      left: `150px`,
    },
    "&.is-2": {
      top: `calc( 100% - 35px )`,
      left: `14px`,
      zIndex: `100`,
    },
    "&.is-3": {
      top: `calc( 100% + 20px )`,
      left: `183px`,
    },
  },
  noSign: {
    display: `block`,
    top: `250px`,
    left: `100%`,
    width: `100px`,
  },
})
