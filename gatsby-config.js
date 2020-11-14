module.exports = {
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-material-ui",
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `gatsbyappsync`,
        fieldName: `gatsbyappsync`,
        url: `https://qloiqdovmfdelgbj3vaushulru.appsync-api.us-east-2.amazonaws.com/graphql`,
        headers: {
          "x-api-key": "da2-cptmqkqbhjdijfn4yd5mfwofxu",
        },
      },
    },
  ],
};
