import React from "react"

import Background from "./DynamicBackground"
import Nav from "./nav"

import "./sanitize.css"
import styles from "./layout.module.css"

export default ({ children }) =>
  <div className={styles.layout}>
    <Background />
    <Nav />
    <main className={styles.main}>
      {children}
    </main>
  </div>
