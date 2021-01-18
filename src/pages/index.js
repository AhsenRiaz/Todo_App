import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import "./style.css";
import { Button, TextField, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Loading from "../components/Loading";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 8, 10),
  },
}));

// This query is executed at runtime by apollo client
const GET_TODOS = gql`
  {
    todos {
      task
      id
      status
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($task: String!) {
    addTodo(task: $task) {
      task
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTodo($id: String!) {
    deleteTodo(id: $id) {
      task
    }
  }
`;

const UPDATE_TASK = gql`
  mutation updateTodo($id: String!, $task: String!) {
    updateTodo(id: $id, task: $task) {
      task
    }
  }
`;

const IndexPage = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [input, setInput] = useState("");
  const [updateInput, setUpdateInput] = useState("");
  const [updateId, setUpdateId] = useState("");
  const { loading, error, data } = useQuery(GET_TODOS);

  const [addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DELETE_TASK);
  const [updateTodo] = useMutation(UPDATE_TASK);

  const addTask = () => {
    addTodo({
      variables: {
        task: input,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setInput(" ");
  };

  const updateTask = async () => {
    updateTodo({
      variables: {
        id: updateId,
        task: updateInput,
      },
      // refetch queries are used to fetch the updated documents from the database
      // no need to use useEffect
      refetchQueries: [{ query: GET_TODOS }],
    });
    setUpdateInput(" ");
    handleClose();
  };

  return (
    <div>
      <div className="input_container">
        <div className="field">
          <TextField
            variant="outlined"
            color="primary"
            label="Add Todo"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <Button disabled = { input.length <= 2} color="primary" variant="outlined" onClick={addTask}>
          Add Task
        </Button>
      </div>

      <h1 style={{ textAlign: "center" }}>Todo List</h1>
      {loading ? <Loading /> : null}
      {error ? <h1>Error</h1> : null}
      {data &&
        data.todos.map((todo, i) => {
          return (
            <Container key={i} maxWidth="sm">
              <div className="todo_container">
                <ul>
                  <div className="todo_wrapper">
                    <div className="list_div">
                      <li>{todo.task}</li>
                    </div>

                    <div className="button_container">
                      <button
                        className="delete_button"
                        onClick={async () => {
                          deleteTodo({
                            variables: { id: todo.id },
                            refetchQueries: [{ query: GET_TODOS }],
                          });
                        }}
                      >
                        Delete
                      </button>

                      <button
                        className="update_button"
                        onClick={() => {
                          handleOpen();
                          setUpdateId(todo.id);
                          console.log("ID", updateId);
                        }}
                      >
                        Update
                      </button>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={open}>
                          <div className={classes.paper}>
                            <TextField
                              value={updateInput}
                              onChange={(e) => {
                                setUpdateInput(e.target.value);
                              }}
                              variant="outlined"
                              label="Updata Todo"
                            />{" "}
                            <br />
                            <Button
                              color="primary"
                              variant="outlined"
                              disabled = {updateInput.length < 3}
                              style={{ marginTop: "1rem" }}
                              onClick={updateTask}
                            >
                              Update
                            </Button>
                          </div>
                        </Fade>
                      </Modal>
                    </div>
                  </div>
                </ul>
              </div>
            </Container>
          );
        })}
    </div>
  );
};

export default IndexPage;