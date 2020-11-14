import * as AWS from "aws-sdk";

const deleteMsg = async (MsgId: string) => {
  const Client = new AWS.DynamoDB.DocumentClient();
  const params: any = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      id: MsgId,
    },
  };
  try {
    await Client.delete(params).promise();
    return MsgId;
  } catch (error) {
    return error.toString();
  }
};
export default deleteMsg;
