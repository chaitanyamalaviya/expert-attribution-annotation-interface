import { useState } from "react";
import "./pagesStyle.css";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [prolificId, setProlificId] = useState("");
  const [alert, setAlert] = useState(false);
  const baseUrl = `/api/tasks/${prolificId}`;

  const onClick = (e) => {
    e.preventDefault();
    axios
      .get(baseUrl)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          setAlert(true);
        } else {
          const todoTasks = response.data.filter(
            (task) => !task.completed
          );
          console.log(todoTasks);
          if (todoTasks.length === 0) {
            navigate("/submission");
          } else {
            navigate("/tasks", { state: { data: todoTasks } });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const renderAlert = () => {
    if (alert) {
      return (
        <Alert
          variant="danger"
          style={{ width: "50rem", marginTop: "20px", textAlign: "left" }}
        >
          {" "}
          No tasks match the provided ID in the database{" "}
        </Alert>
      );
    }
  };

  return (
    <div align="center">
      <Card style={{ width: "50rem", marginTop: "20px" }}>
        <Card.Body>
          <Card.Title>
            {" "}
            <b>Rewriting Examples of Expert Tasks: Instructions </b>{" "}{" "}
          </Card.Title>
          <Card.Text style={{ textAlign: "left" }}>
            <p>
              {" "}
              We are a group of researchers at Alphabet building AI systems that
              can assist experts in various fields. Using your help, <b>we would 
              like to evaluate the capability of AI models in assisting experts
              from different fields with their tasks</b>.{" "}
            </p>
            <p>
              {" "}
              Thank you for participating in the previous part of our study
              where you provided us with descriptions of writing tasks from
              your field. The next part of the study involves labeling and
              rewriting examples of these tasks. We will show you examples
              that fit your task description and ask you to label the example
              for its depth, structure, factual correctness and citation
              quality. Based on your assessment of each example, you will need
              to rewrite the example to overcome the identified issues.{" "}
            </p>
            <p>
              <b>
                {" "}
                <i> Note about completion time: </i>
              </b>{" "}
              Note that we have made a best estimate for how long it should take
              to complete this task, based on a small number of participants.
              However, the time spent can vary across participants and across
              examples. If you end up spending more time than the allocated
              time, please feel free to let us know and we would be happy to
              bonus you for the extra time spent. Please prioritize{" "}
              <b> quality </b> and do not rush through the task. You will get a
              completion code after you finish annotating all examples.{" "}
            </p>
            {/* <p>
              {" "}
              <font color="maroon">
                {" "}
                <b>
                  **Before moving on, please watch the following instruction
                  video for this task{" "}
                  <a
                    href="https://www.loom.com/share/29690d5feb9b4663b77e2dc807a6b0b9?sid=2b00e524-3f02-4c60-a260-73cb32e9b15e"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {" "}
                    here
                  </a>{" "}
                  **{" "}
                </b>{" "}
              </font>{" "}
            </p> */}
            Please enter your prolific ID down below to begin:
            <Form
              style={{ marginTop: "10px", width: "400px" }}
              onSubmit={onClick}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Enter Prolific ID"
                  onChange={(text) => setProlificId(text.target.value)}
                />
              </Form.Group>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
      {renderAlert()}
      <Button
        variant="outline-primary"
        onClick={onClick}
        style={{ marginTop: "20px" }}
      >
        {" "}
        Submit and start task{" "}
      </Button>
    </div>
  );
};

export default WelcomePage;
