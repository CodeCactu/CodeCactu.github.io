module.exports = {
  siteMetadata: {
    author: `Paweł Stolarski; Evolveye`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `codecactu-website`,
        short_name: `codecactu`,
        start_url: `/`,
        background_color: `#212526`,
        theme_color: `#5da234`,
        display: `minimal-ui`,
        icon: `src/images/logo-cactu.png`,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
