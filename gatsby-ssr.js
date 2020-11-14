// import { wrapRootElement } from "./src/apollo/wrap-root-element";
import Amplify from "aws-amplify";
Amplify.configure({
  aws_appsync_graphqlEndpoint:
    "https://qloiqdovmfdelgbj3vaushulru.appsync-api.us-east-2.amazonaws.com/graphql",
  aws_appsync_region: "us-east-2",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-cptmqkqbhjdijfn4yd5mfwofxu",
});

// export { wrapRootElement };
