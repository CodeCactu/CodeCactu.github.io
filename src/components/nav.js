import React from "react"
import { Link } from "gatsby"

import styles from "./nav.module.css"

const items = [
  `GitHub`,
  `Discord bot framework`,
  `CactuJams`,
]

export default () =>
  <nav className={styles.nav}>
    <ul className={styles.items}>
      {
        items.map( item =>
          <li className={styles.item}>
            <Link to="" className={`${styles.link} is-not-decorative`}>
              <span className={`${styles.bracket} ${styles.isLeft}`}>[</span>{item}<span className={`${styles.bracket} ${styles.isRight}`}>]</span>
            </Link>
          </li>
        )
      }
    </ul>
  </nav>