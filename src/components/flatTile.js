import React from "react"
import Image from "gatsby-image"

import styles from "./flatTile.module.css"
import { Link } from "gatsby"

const getWrapper = (className, content, linkAddress=``) => {
  if (!linkAddress) return <div className={className}>{content}</div>
  if (/http/.test( linkAddress )) return <a className={`${className} is-not-decorative`} href={linkAddress}>{content}</a>

  return <Link className={`${className} is-not-decorative`} to={linkAddress}>{content}</Link>
}

export default ({ className, fluid, title, color, description, linkAddress }) =>
  <article>
    {getWrapper(
      `${styles.tile}${className ? ` ` + className : ``}`,

      <>
        {fluid && <Image className={styles.icon} fluid={fluid} alt="Cactu logo" />}

        <div className={styles.data}>
          <span className={styles.title} style={{ color }} >{title}</span>
          <span className={styles.description}>{description}</span>
        </div>
      </>,

      linkAddress
    )}
  </article>