import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import FlatTile from "../components/flatTile"

import styles from "./bot.module.css"

 /**
 * @typedef {Object} QueryFlow
 * @property {Object} childImageSharp
 * @property {Object} childImageSharp.fluid
 */

/**
 * @typedef {Object} QueryData
 * @property {QueryFlow} logo
 */

 /**
  * @module
  * @param {Object} param0
  * @param {QueryData} param0.data
  */
export default ({ data }) =>
  <Layout className={styles.content}>
    <FlatTile
      className={styles.botname}
      fluid={data.logo.childImageSharp.fluid}
      title="CodeCactu"
      color="#4ee910"
      description={<>Watching <strong className={styles.highlightedActivity}>cc!</strong></>}
    />
    <FlatTile
      className={styles.actionField}
      title="Invite me"
      color="#f47fff"
      linkAddress="https://discord.com/api/oauth2/authorize?client_id=379234773408677888&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=bot"
    />
    <FlatTile
      className={styles.actionField}
      title="Configure me"
      color="cornflowerblue"
      linkAddress="/bot-config"
    />
    <FlatTile
      className={`${styles.actionField} ${styles.isDisabled}`}
      title="Run me on your own"
      color="coral"
      description="Coming soon..."
    />
  </Layout>

export const query = graphql`
  query Bot {
    logo: file( relativePath:{ eq:"logo-cactu.png" } ) {
      childImageSharp {
        fluid( maxWidth:50 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
