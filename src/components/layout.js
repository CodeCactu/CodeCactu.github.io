import React from "react"

import Background from "./DynamicBackground"
import Nav from "./nav"

import styles from "./layout.module.css"

export default ({ children }) =>
  <div className={styles.layout}>
    <Nav />
    <Background />
    <main className={styles.main}>
      {children}
    </main>
  </div>
