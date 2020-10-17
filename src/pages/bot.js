import React from "react"

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
      title="Invite"
      color="#f47fff"
    />
    <FlatTile
      className={styles.actionField}
      title="Configure"
      color="cornflowerblue"
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
