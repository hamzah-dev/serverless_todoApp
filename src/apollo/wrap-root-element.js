//not using it in project

import React from "react";
import fetch from "cross-fetch";
import { createAuthLink } from "aws-appsync-auth-link";
import { AWSAppSyncClient, createAppSyncLink } from "aws-appsync";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import AppSync from "./AppSync";
// import { mainclient } from "./client";
import { Rehydrated } from "aws-appsync-react";

const httpLink = createHttpLink({
  uri: AppSync.aws_appsync_graphqlEndpoint,
});

const awsLink = createAppSyncLink({
  url: AppSync.aws_appsync_graphqlEndpoint,
  region: AppSync.aws_appsync_region,
  auth: {
    type: AppSync.aws_appsync_authenticationType,
    apiKey: AppSync.aws_appsync_apiKey,
  },
});

const client = new ApolloClient({
  link: awsLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const wrapRootElement = ({ element }) => {
  return <ApolloProvider client={client}>{element}</ApolloProvider>;
};

// methid 1

// const config = {
//   url: AppSync.aws_appsync_graphqlEndpoint,
//   region: AppSync.aws_appsync_region,
//   auth: {
//     type: AppSync.aws_appsync_authenticationType,
//     apiKey: AppSync.aws_appsync_apiKey,
//   },
// };
// const client = new ApolloClient({
//   link: ApolloLink.from([
//     createAuthLink(config),
//     createSubscriptionHandshakeLink(config),
//   ]),
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: "cache-and-network",
//     },
//   },
// });
