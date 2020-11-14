import * as AWS from "aws-sdk";
import { MessageType } from "./message";

const createMsg = async (msg: MessageType) => {
  const Client = new AWS.DynamoDB.DocumentClient();
  const params: any = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: msg,
  };
  try {
    await Client.put(params).promise();
    return msg;
  } catch (error) {
    return error.toString();
  }
};

export default createMsg;
