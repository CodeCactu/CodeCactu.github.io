import CactuBanner from "@fet/CactuBanner"
import classes from "./page.module.css"
import cn from "@lib/core/functions/createClassName"

export default function Home() {
  return (
    <>
      {/* <TiledCactuLogo /> */}

      <div>
        {/* <h1>Platforma oceny prac CactuJam</h1>
        <div className={classes.leftBar}>
          <p className={cn( classes.link )}>
            Zaloguj się za pomocą platformy Discord
          </p>
        </div> */}

        <p style={
          {
            margin: 25,
            fontFamily: `var( --font-cactu )`,
            padding: 25,
            fontSize: 50,
            backgroundColor: `white`,
            color: `black`,
          }
        }
        >
          abcdefghijkl<br />
          mnopqrstuvwxyz
        </p>
        <CactuBanner />
      </div>
    </>
  )
}
