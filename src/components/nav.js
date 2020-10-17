import React from "react"
import { Link } from "gatsby"

import styles from "./nav.module.css"

const items = [
  { name:`GitHub`, address:`` },
  { name:`Discord bot framework`, address:`` },
  { name:`CactuJams`, address:`` },
]

export default () =>
  <nav className={styles.nav}>
    <ul className={styles.items}>
      {
        items.map( ({ name, address }) =>
          <li key={name} className={styles.item}>
            <Link to={address} className={`${styles.link} is-not-decorative`}>
              <span className={`${styles.bracket} ${styles.isLeft}`}>[</span>{name}<span className={`${styles.bracket} ${styles.isRight}`}>]</span>
            </Link>
          </li>
        )
      }
    </ul>
  </nav>