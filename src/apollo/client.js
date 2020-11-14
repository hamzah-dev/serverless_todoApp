//not using it in project

import { AWSAppSyncClient } from "aws-appsync";
import AppSync from "./AppSync";
import { createHttpLink } from "@apollo/react-hooks";
// import { AUTH_TYPE, createAppSyncLink } from "aws-appsync";
const { ApolloLink } = require(`apollo-link`);

// const url = AppSync.aws_appsync_graphqlEndpoint;
// const region = AppSync.aws_appsync_region;
// const auth = {
//   type: AUTH_TYPE.API_KEY,
//   apiKey: AppSync.aws_appsync_apiKey,
// };
// const link = ApolloLink.from([
//   createAppSyncLink({ url, region, auth }),
//   createHttpLink({ uri: url }),
// ]);

// const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });
