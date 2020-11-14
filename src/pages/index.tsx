import React, { useEffect, useState } from "react";
import { DocumentNode, gql } from "@apollo/client";
import { API } from "aws-amplify";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  CircularProgress,
  Grid,
  IconButton,
} from "@material-ui/core";
import shortId from "shortid";
import DeleteIcon from "@material-ui/icons/Delete";

const MyStyle = makeStyles(() => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },

  formContainer: {
    background: "#f3f3f3",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "5px",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "600px",
    marginTop: "20px",
  },
  Datalist: {
    background: "#f9f9f9",
    padding: "10px 20px",
    marginBottom: "4px",
    // borderBottom: "1px solid #f3f3f3",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    height: "100px",
  },
}));

const allTodos = `
  {
    AllMessages {
      id
      message
    }
  }
`;
const createTodos = `
  mutation MyMutation($newMessage: MessageInput!) {
    createMessage(newMessage:$newMessage) {
      id
      message
    }
  }
`;

const deleteTodos = `
  mutation deleteMutation($MsgId: String!){
    deleteMessage(MsgId:$MsgId)
  }
`;

const Index = () => {
  const classes = MyStyle();
  const [data, setData] = React.useState<any>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data: any = await API.graphql({ query: allTodos });
      setData({ AllMessages: data.data.AllMessages });
    })();
  }, [setData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id: string = shortId.generate();
    setLoading(true);
    const res: any = await API.graphql({
      query: createTodos,
      variables: { newMessage: { id: id, message: message } },
    });
    let readonly = await data.AllMessages.map((item) => {
      return item;
    });
    // inserting response in the state
    await readonly.push(res.data.createMessage);
    if (readonly) {
      setData({ AllMessages: readonly });
      setLoading(false);
      setMessage("");
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    await API.graphql({
      query: deleteTodos,
      variables: { MsgId: id },
    });
    let Datadel = await data.AllMessages.filter((item) => {
      return item.id !== id;
    });
    if (Datadel) {
      setData({ AllMessages: Datadel });
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <div className={classes.mainContainer}>
          <Box py={8}>
            <Typography variant="h5">SERVERLESS GRAPHQL TODO APP</Typography>
          </Box>
          <div className={classes.formContainer}>
            <Box p={4}>
              <form onSubmit={handleSubmit}>
                <Box pb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Message"
                    name="task"
                    required
                  />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                  add task
                </Button>
              </form>
            </Box>
          </div>
          <div className={classes.contentWrapper}>
            <Box py={1}>
              {!data || loading ? (
                <div className={classes.loadingWrapper}>
                  <CircularProgress />
                </div>
              ) : (
                data.AllMessages.map((msg) => (
                  <div key={msg.id} className={classes.Datalist}>
                    <Grid container>
                      <Grid item xs={10} container alignItems="center">
                        <Typography>{msg.message}</Typography>
                      </Grid>
                      <Grid container justify="flex-end" item xs={2}>
                        <IconButton onClick={() => handleDelete(msg.id)}>
                          <DeleteIcon color="secondary" fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </div>
                ))
              )}
            </Box>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Index;
