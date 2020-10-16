import React from "react"

import Background from "../components/DynamicBackground"
import Banner from "../components/Banner"

import styles from "./index.module.css"

export default () =>
  <header className={styles.header}>
    <Background />
    <Banner />
  </header>
