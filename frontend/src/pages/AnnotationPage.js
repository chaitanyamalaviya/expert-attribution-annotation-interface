import { useState, useEffect } from "react";
import Task from "../components/QuestionAnswer";
import "./pagesStyle.css";
import ExampleEvidence from "../components/ClaimEvidence";
import { Button, Alert, ProgressBar, Card, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AnnotationPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.data;
  const [seconds, setSeconds] = useState();
  const [currentTask, setCurrentTask] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);
  const [revisedExamples, setRevisedExamples] = useState(
    data[currentTask].examples.map((example) => example.example_text)
  );
  const [revisedEvidences, setRevisedEvidences] = useState(
    data[currentTask].examples.map((example) => example.evidence.join("\n\n"))
  );
  const emptyTask = {
  };
  const emptyExample = {
    structure_followed: "",
    depth: "",
    attribution: "",
    factuality: "",
  };
  const [taskAnnotation, setTaskAnnotation] = useState(emptyTask);
  const [exampleAnnotation, setExampleAnnotation] = useState(emptyExample);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    setSeconds(new Date());
  }, []);

  const buttonInstructions = () => {
    if (currentExample < data[currentTask].examples.length - 1) {
      return <div> Move onto the next example below! </div>;
    } else if (currentExample === data[currentTask].examples.length - 1) {
      return <div> Submit your final example! </div>;
    } else if (currentTask < data.length - 1) {
      return <div> Move onto the next task! </div>;
    } else {
      return (
        <div>
          {" "}
          You are now done with all the tasks! Press submit
          to get the completion code.{" "}
        </div>
      );
    }
  };

  const buttonText = () => {
    if (currentExample <= data[currentTask].examples.length - 1) {
      return (
        <Button
          variant="outline-primary"
          style={{ marginLeft: "520px" }}
          onClick={buttonAction()}
        >
          {" "}
          Submit example{" "}
        </Button>
      );
    } else if (currentTask < data.length - 1) {
      return (
        <Button
          variant="outline-primary"
          style={{ marginLeft: "495px" }}
          onClick={buttonAction()}
        >
          {" "}
          Submit task{" "}
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline-primary"
          style={{ marginLeft: "390px" }}
          onClick={buttonAction()}
        >
          {" "}
          Submit task and finish{" "}
        </Button>
      );
    }
  };

  const buttonAction = () => {
    // submit example
    if (currentExample <= data[currentTask].examples.length - 1) {
      return () => {
        // validation logic
        const new_array = [];
        const mapping = {
          structure_followed: "Structure Followed",
          depth: "Depth",
          attribution: "Attribution",
          factuality: "Factual Correctness",
        };
        for (var field in exampleAnnotation) {
          if (exampleAnnotation[field] === "") {
            new_array.push(mapping[field]);
          }
        }
        setMissingFields(new_array);
        if (new_array.length > 0) {
          return () => {};
        }
        setMissingFields([]);

        // console.log(exampleAnnotation);

        axios.interceptors.request.use((request) => {
          //   console.log("Starting Request", JSON.stringify(request, null, 2));
          return request;
        });

        // api call
        axios
          .patch(
            `/api/annotate/task/${data[currentTask]._id}/example/${currentExample}`,
            {
              ...exampleAnnotation,
              revised_example: revisedExamples[currentExample],
              revised_evidence: revisedEvidences[currentExample],
            }
          )
          .then((response) => {
            // console.log(response);
          })
          .catch((error) => console.log(error));

        // rescroll & state updates
        const element = document.getElementById("example-evidence-section");
        element.scrollIntoView({ behavior: "smooth" });
        setCurrentExample(currentExample + 1);
        setExampleAnnotation(emptyExample);
        // console.log(revisedExamples)
        // console.log(revisedEvidences)
      };
    }
    // submit task
    else {
      if (currentTask < data.length - 1) {
        return () => {
          // validation logic
          // if (taskAnnotation.usefulness === "") {
          //   setMissingFields(missingFields.concat("Usefulness"));
          //   return () => {};
          // }
          if (missingFields.length > 0) {
            setMissingFields([]);
          }

          // console.log(taskAnnotation)

          // api call
          const revisedAnswer =
            taskAnnotation.revised_answer === ""
              ? "<Answer>\n\n" +
                revisedExamples.join("\n") +
                "\n\n<Evidences>\n\n" +
                revisedEvidences.join("\n")
              : taskAnnotation.revised_answer;
          const endTime = new Date();

          axios
            .patch(`/api/annotate/task/${data[currentTask]._id}`, {
              completed: true,
              revised_answer: revisedAnswer,
              time_spent: endTime - seconds,
            })
            .then((response) => {
              // console.log(response)
            })
            .catch((error) => console.log(error));

          // rescroll & state updates
          setSeconds(endTime);
          setCurrentExample(0);
          setRevisedExamples(
            data[currentTask + 1].examples.map((example) => example.example_string)
          );
          setRevisedEvidences(
            data[currentTask + 1].examples.map((example) =>
              example.evidence.join("\n\n")
            )
          );
          setCurrentTask(currentTask + 1);
          window.scrollTo(0, 0);
          setTaskAnnotation(emptyTask);
        };
      }
      // submit final task
      else {
        return () => {
          // validation logic
          // if (taskAnnotation.usefulness === "") {
          //   setMissingFields(missingFields.concat("Usefulness"));
          //   return () => {};
          // }
          if (missingFields.length > 0) {
            setMissingFields([]);
          }

          // api call
          const revisedAnswer =
            taskAnnotation.revised_answer === ""
              ? "<Answer>\n\n" +
                revisedExamples.join("\n") +
                "\n\n<Evidences>\n\n" +
                revisedEvidences.join("\n")
              : taskAnnotation.revised_answer;
          const endTime = new Date();
          // console.log(endTime - seconds)

          axios
            .patch(`/api/annotate/task/${data[currentTask]._id}`, {
              completed: true,
              revised_answer: revisedAnswer,
              time_spent: endTime - seconds,
            })
            .then((response) => {
              // console.log(response)
            })
            .catch((error) => console.log(error));

          navigate("/submission");
        };
      }
    }
  };

  const answerChange = (event) => {
    const newState = {
      ...taskAnnotation,
    };
    newState["revised_answer"] = event.target.value;
    setTaskAnnotation(newState);
  };

  const renderExampleEvidence = () => {
    if (currentExample < data[currentTask].examples.length) {
      return (
        <div id="example-evidence-section">
          <Alert
            style={{ width: "80%", marginTop: "20px", textAlign: "left" }}
          >
            <p>
              {" "}
              You will be asked to annotate the examples for the task below.
              Each example is a sample of the task with concrete details.
              The evidence is presented in the form of URL(s) accompanied with
              a relevant passage from each webpage.{" "}
            </p>
            <p>
              You are on <b> task {currentTask + 1}</b>. This task
              has <b> {data[currentTask].examples.length} examples. </b>
            </p>
            <p>
              Current Example: {currentExample + 1} out of{" "}
              {data[currentTask].examples.length}
            </p>
            <ProgressBar
              variant="primary"
              now={
                ((currentExample + 1) * 100.0) /
                data[currentTask].examples.length
              }
              style={{ width: "38rem", marginTop: "20px" }}
            />
          </Alert>
          <ExampleEvidence
            task={"Task Objective: " + data[currentTask].task_objective + "\n\nTask Procedure: " + data[currentTask].task_procedure + "\n\nTask Input: " + data[currentTask].task_input + "\n\nTask Output: " + data[currentTask].task_output + "\n\nAdditional Notes: " + data[currentTask].task_notes}
            example={data[currentTask].examples[currentExample].example_text}
            evidence={data[currentTask].examples[currentExample].evidence}
            currentExample={currentExample}
            revisedExamples={revisedExamples}
            setRevisedExamples={setRevisedExamples}
            revisedEvidences={revisedEvidences}
            setRevisedEvidences={setRevisedEvidences}
            exampleAnnotation={exampleAnnotation}
            setExampleAnnotation={setExampleAnnotation}
            taskAnnotation={taskAnnotation}
            setTaskAnnotation={setTaskAnnotation}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Alert
            style={{ width: "80%", marginTop: "20px", textAlign: "left" }}
          >
            <p>
              {" "}
              5) <b> Answer Revision </b> : Based on the changes to the
              individual examples, this is your edited answer. Would you like to
              add, edit or delete it any further? Note that we require the
              answer to be <b>factual</b>, <b>complete</b> and{" "}
              <b> supported by reliable evidence (if it was provided by us).</b>
            </p>
          </Alert>
          <Card
            style={{ width: "80%", marginTop: "20px", textAlign: "left" }}
          >
            <Card.Body>
              <Card.Title>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {"Revise answer below:"}
                  <div
                    style={{
                      color: "red",
                      marginLeft: "3px",
                      fontSize: "17px",
                    }}
                  >
                    {" "}
                    *{" "}
                  </div>
                </div>
              </Card.Title>
              <Card.Text>
                <Form style={{ marginTop: "21px", width: "400px" }}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      style={{ height: "500px", width: "600px" }}
                      as="textarea"
                      defaultValue={
                        "<Answer>\n\n" +
                        revisedExamples.join("\n") +
                        "\n\n<Evidences>\n\n" +
                        revisedEvidences.join("\n\n")
                      }
                      onChange={answerChange}
                    />
                  </Form.Group>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };

  const renderAlert = () => {
    if (missingFields.length > 0) {
      return (
        <Alert
          variant="danger"
          style={{ width: "80%", marginTop: "20px", textAlign: "left" }}
        >
          {" "}
          Please submit the following required fields before submitting:{" "}
          {missingFields.join(", ")}{" "}
        </Alert>
      );
    }
  };

  return (
    <div align="center">
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <p>
          {" "}
          <h3> Rewriting Examples of Expert Tasks </h3>
        </p>
        <p>
          This study has <b> {data.length} tasks. </b>
        </p>
        Current Task: {currentTask + 1} out of {data.length}
        <ProgressBar
          variant="primary"
          now={((currentTask + 1) * 100.0) / data.length}
          style={{ width: "38rem", marginTop: "20px", marginBottom: "20px" }}
        />
        <p>
          {" "}
          Make sure to <b> follow the instructions carefully </b> and submit all
          the tasks! If an <b>error</b> occurs in the interface, just click
          on the link again and provide your ID.{" "}
        </p>
      </Alert>
      {/* <Task
        task={"Task Objective: " + data[currentTask].task_objective + "\n\nTask Procedure: " + data[currentTask].task_procedure + "\n\nTask Input: " + data[currentTask].task_input + "\n\nTask Output: " + data[currentTask].task_output + "\n\nAdditional Notes: " + data[currentTask].task_notes}
        taskAnnotation={taskAnnotation}
        setTaskAnnotation={setTaskAnnotation}
      /> */}
      {renderExampleEvidence()}
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        {buttonInstructions()}
      </Alert>
      {renderAlert()}
      <div className="buttons">{buttonText()}</div>
    </div>
  );
};

export default AnnotationPage;
