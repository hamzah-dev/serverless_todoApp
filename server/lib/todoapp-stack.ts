import * as cdk from "@aws-cdk/core";
import * as appSync from "@aws-cdk/aws-appsync";
import * as dynamoDB from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

export class TodoappStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3 bucket
    const bucket = new s3.Bucket(this, "s3Bucket", {
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });
    //s3 bucket deployment
    new s3Deployment.BucketDeployment(this, "bucketDeployment", {
      sources: [s3Deployment.Source.asset("../public")],
      destinationBucket: bucket,
    });
    //cloudfront (aws cdn)
    new cloudfront.CloudFrontWebDistribution(this, "DistributionWebBucket", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    //creating api
    const api = new appSync.GraphqlApi(this, "api", {
      name: "todos-appsync-api",
      schema: appSync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    //this will print graogql url in the terminal
    new cdk.CfnOutput(this, "graphqlApiUrl", {
      value: api.graphqlUrl,
    });
    //this will print graphql key in the terminal
    new cdk.CfnOutput(this, "GraphqlApiKey", {
      value: api.apiKey || "",
    });

    //this will print api id in the terminal
    new cdk.CfnOutput(this, "region", {
      value: this.region,
    });

    // createing table in dynamodb
    const dynamoTable = new dynamoDB.Table(this, "messageTable", {
      billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
      //it is like primary key
      partitionKey: {
        name: "id",
        type: dynamoDB.AttributeType.STRING,
      },
    });

    // lambda contruct
    const messageLambda = new lambda.Function(this, "messageHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "messageApi.handler",
      code: lambda.Code.fromAsset("lambda"),
      memorySize: 1024,
      environment: {
        DYNAMODB_TABLE_NAME: dynamoTable.tableName,
      },
    });

    // new lambda function as a datasource
    const lambda_Datasource = api.addLambdaDataSource(
      "lambda_datasource",
      messageLambda
    );

    // Attaching the graphql resolvers
    lambda_Datasource.createResolver({
      typeName: "Query",
      fieldName: "AllMessages",
    });
    lambda_Datasource.createResolver({
      typeName: "Mutation",
      fieldName: "createMessage",
    });
    lambda_Datasource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteMessage",
    });

    // giving permission to lambda functions to access dynamoTable using IAM
    dynamoTable.grantFullAccess(messageLambda);
  }
}
