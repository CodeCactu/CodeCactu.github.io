import React from "react"
import Image from "gatsby-image"

import styles from "./flatTile.module.css"

export default ({ className, fluid, title, color, description }) =>
  <article className={`${styles.tile}${className ? ` ` + className : ``}`} >
    {fluid && <Image className={styles.icon} fluid={fluid} alt="Cactu logo" />}

    <div className={styles.data}>
      <span className={styles.title} style={{ color }} >{title}</span>
      <span className={styles.description}>{description}</span>
    </div>
  </article>