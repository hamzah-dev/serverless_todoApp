import createMsg from "./createMsg";
import deleteMsg from "./deleteMsg";
import allMsgs from "./allMsgs";
import { MessageType } from "./message";

type AppsyncType = {
  info: {
    fieldName: string;
  };
  arguments: {
    MsgId: string;
    newMessage: MessageType;
  };
};

exports.handler = async (event: AppsyncType) => {
  switch (event.info.fieldName) {
    case "AllMessages":
      return await allMsgs();
    case "createMessage":
      return await createMsg(event.arguments.newMessage);
    case "deleteMessage":
      return await deleteMsg(event.arguments.MsgId);
    default:
      return null;
  }
};
