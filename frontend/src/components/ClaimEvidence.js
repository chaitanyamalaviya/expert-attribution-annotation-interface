import Textbox from "./Textbox";
import Likert from "./Likert";
import Answerbox from "./Answerbox";
import { Alert, Card, Form } from "react-bootstrap";
import React, { useState } from 'react';
import "./componentStyle.css";


function NewlineText({ text }) {
  const newText = text.split('\n').map((str, index, array) => 
    index === array.length - 1 ? str : <>
      {str}
      <br />
    </>
  );
  return <>{newText}</>;
}

const EvidenceText = ({ evidenceTextArray }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const displayEvidence = () => {
    const result = [];
    for (const item of evidenceTextArray) {
      const parsed = item.split('\n\n');
      const e = parsed[0];
      result.push(
        <div> 
          <a href={e.substring(e.indexOf(']') + 2)} 
             target="_blank" 
             rel="noreferrer noopener" 
             style={{ textDecoration: 'none' }}>
            {e}
          </a> 
          <br />
        </div>
      );
      if (parsed.length > 1) {
        result.push(<div> {parsed[1]} </div>);
      }
      result.push(<br />);
    }
    return result;
  };

  return (
    <div>
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        style={{
          cursor: 'pointer', 
          textDecoration: 'underline',
          display: 'flex',
          alignItems: 'center'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#007BFF'}
        onMouseOut={(e) => e.currentTarget.style.color = ''}
      >
        <h4 style={{ marginRight: '10px' }}>Evidence Passages:</h4>
        <span>{isCollapsed ? '▼' : '▲'}</span>
      </div>
      {!isCollapsed && displayEvidence()}
    </div>
  );
};


const ExampleEvidence = (props) => {
  const reviseExample = (text) => {
    const newExample = props.revisedExamples.map((c, i) => {
      if (i === props.currentExample) {
        return text.target.value;
      } else {
        return c;
      }
    });
    props.setRevisedExamples(newExample);
  };

  const reviseEvidence = (text) => {
    const newEvidence = props.revisedEvidences.map((c, i) => {
      if (i === props.currentExample) {
        return text.target.value;
      } else {
        return c;
      }
    });
    props.setRevisedEvidences(newEvidence);
  };

  return (
    <div>
      {/* <Textbox title="Task Description" text={props.task} /> */}
      <Card style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block', width: 'calc(40% - 10px)', marginRight: '10px', verticalAlign: 'top', backgroundColor: '#c3d9ef' }}>
          <Card.Body>
              <Card.Title> {"Task Description:"} </Card.Title>
              <Card.Text>
                  {<NewlineText text={props.task} />}
              </Card.Text>
          </Card.Body>
      </Card>
      <Card style={{ display: 'inline-block', width: 'calc(40% - 10px)', marginTop: '20px', textAlign: 'left', verticalAlign: 'top', backgroundColor: '#CFF1D6' }}>
          <Card.Body>
              <Card.Title> {"Example:"} </Card.Title>
              <Card.Text>
                  {<NewlineText text={props.example} />}
              </Card.Text>
          </Card.Body>
      </Card>
      <div>
          <Alert
              style={{
                  width: "80%",
                  marginTop: "20px",
                  textAlign: "left",
              }}>
              <EvidenceText evidenceTextArray={props.evidence} />
          </Alert>
      </div>
      {/* <Textbox title="Example" text={props.example} /> */}
      {/* <Textbox title="Evidence" text={props.evidence} /> */}
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <p>
          {/* {" "} */}
          <b>Structure Followed: </b> Does the example follow the basic
          structure of the task shown above?{" "}
        </p>
        {/* <ol>
          <li>
            {" "}
            Yes: The example contains all the sections in the same order as the
            task description.{" "}
          </li>
          <li>
            {" "}
            No: The example is missing the title/content of at least 1 section
            OR sections are given in the wrong order.{" "}
          </li>
        </ol> */}
      </Alert>
      <Likert
        title="Structure Followed"
        options={[
          <>
            <strong>Yes</strong>: The example contains all the sections in the same order as the task description.
          </>,
          <>
            <strong>No</strong>: The example is missing the title/content of at least 1 section OR sections are given in the wrong order.
          </>,
        ]}
        state={props.exampleAnnotation}
        setState={props.setExampleAnnotation}
        toChange="structure_followed"
      />
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <p>
          {/* {" "} */}
          <b>Depth: </b> Does the example show a detailed and concrete instance
          of the task?{" "}
        </p>
        {/* <ol>
          <li>
            {" "}
            Definitely: This example is high-quality and could have been written
            by an expert in the field.{" "}
          </li>
          <li>
            {" "}
            To some extent: The example follows the basic structure of the task
            but the content could use a slight bit of work.{" "}
          </li>
          <li>
            {" "}
            Not quite: The example follows the basic structure of the task but
            the content is far from being a real example of this task.{" "}
          </li>
          <li>
            {" "}
            Definitely not: The example is lacking in various ways (including its
            structure and content) and is nowhere close to being a real example
            of the task.{" "}
          </li>
        </ol> */}
      </Alert>
      <Likert
        title="Depth"
        options={[
          <>
            <strong>Definitely</strong>: This example is high-quality and could have been written by an expert in the field.
          </>,
          <>
            <strong>To some extent</strong>: The example follows the basic structure of the task but the content could use a slight bit of work.
          </>,
          <>
            <strong>Not quite</strong>: The example follows the basic structure of the task but the content is far from being a real example of this task.
          </>,
          <>
            <strong>Definitely not</strong>: The example is lacking in various ways (including its structure and content) and is nowhere close to being a real example of the task.
          </>,
        ]}
        state={props.exampleAnnotation}
        setState={props.setExampleAnnotation}
        toChange="depth"
      />
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <p>
          {/* {" "} */}
          <b>Attribution: </b> Are the claims in the example completely supported
          by the evidence cited?
        </p>
        {/* <ol>
          <li> Complete: The example is fully supported by the evidence. </li>
          <li> Incomplete: The evidence does not entail the example at all. </li>
          <li> Missing: Does not contain any accompanying evidence. </li>
        </ol> */}
        <p>
          <b>
            Note that we are not asking you to judge whether the example is
            correct, simply whether the example is supported by the evidence,
            even if it comes from an unreliable source.
          </b>
        </p>
        <p>
          You can assume that certain common sense facts don't need to be 
          explicitly stated in the evidence to judge support. While judging
          support, you may be directed to very long passages. Pleas only skim
          the passages and use Ctrl+F keyword searches to find relevant evidence.
        </p>
      </Alert>
      <Likert
        title="Attribution"
        options={[
          <>
            <strong>Complete</strong>: The example is fully supported by the evidence.
          </>,
          <>
            <strong>Incomplete</strong>: The evidence does not entail the example at all.
          </>,
          <>
            <strong>Missing</strong>: Does not contain any accompanying evidence.
          </>,
        ]}
        state={props.exampleAnnotation}
        setState={props.setExampleAnnotation}
        toChange="attribution"
        currentExample={props.currentExample}
      />
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <p>
          {/* {" "} */}
          <b>Factual Correctness: </b> Is the example factually correct?
        </p>
        {/* <ol>
          <li>
            {" "}
            Definitely correct: Absolutely sure that every word of the example is
            correct.{" "}
          </li>
          <li>
            {" "}
            Probably correct: Not completely sure, but it is likely that this
            example is entirely correct.{" "}
          </li>
          <li> Unsure: Cannot make an informed judgment about the example. </li>
          <li>
            {" "}
            Likely incorrect: Not completely sure, but there are parts in the
            example that are likely incorrect.{" "}
          </li>
          <li>
            {" "}
            Definitely incorrect: Absolutely sure that there is at least a part
            of the example that is incorrect.{" "}
          </li>
        </ol> */}
        <p>
          Judge whether the example is factually correct. This can be based on
          your own expertise, the evidence returned by the system as well as
          minimal browsing on the internet to verify correctness. Note that for
          an example to be definitely correct, you would need to be sure of
          every single aspect of that example.
        </p>
        <p>
          Please don't spend longer than 5-10 minutes verifying the correctness
          of each example.
        </p>
      </Alert>
      <Likert
        title="Factual Correctness"
        options={[
          <>
            <strong>Definitely correct</strong>: Absolutely sure that every word of the example is correct.
          </>,
          <>
            <strong>Probably correct</strong>: Not completely sure, but it is likely that this example is entirely correct.
          </>,
          <>
            <strong>Unsure</strong>: Cannot make an informed judgment about the example.
          </>,
          <>
            <strong>Likely incorrect</strong>: Not completely sure, but there are parts in the example that are likely incorrect.
          </>,
          <>
            <strong>Definitely incorrect</strong>: Absolutely sure that there is at least a part of the example that is incorrect.
          </>,
        ]}
        state={props.exampleAnnotation}
        setState={props.setExampleAnnotation}
        toChange="factuality"
      />
      <Alert style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <b> Example Revision: </b> Please edit the above example and references
        to ensure that the example is <b>detailed and concrete</b>, as if it is
        written by an expert in your field, <b> factually correct </b> and{" "}
        <b> supported by references </b>. Please add, modify, or remove the
        text in the example and update references as you see fit.
        <br></br>
      </Alert>
      <Card style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {"Revise example below:"}
              <div
                style={{ color: "red", marginLeft: "3px", fontSize: "17px" }}
              >
                {" "}
                *{" "}
              </div>
            </div>
          </Card.Title>
          <Card.Text>
            <Form style={{ marginTop: "21px" }}>
              <Form.Group className="mb-3">
                <div key={props.example}>
                  <Form.Control
                    style={{ 
                      height: "600px",
                      width: "100%",
                      backgroundColor: "#CFF1D6",
                      border: "1px solid #ced4da", // Bootstrap's default border color
                      boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)", // Bootstrap's default focus shadow
                    }}
                    as="textarea"
                    defaultValue={props.example}
                    onChange={reviseExample}
                  />
                </div>
              </Form.Group>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card style={{ width: "80%", marginTop: "20px", textAlign: "left" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {"Revise evidence below:"}
              <div
                style={{ color: "red", marginLeft: "3px", fontSize: "17px" }}
              >
                {" "}
                *{" "}
              </div>
            </div>
          </Card.Title>
          <Card.Text>
            <Form style={{ marginTop: "21px" }}>
              <Form.Group className="mb-3">
                <div key={props.example}>
                  <Form.Control
                    style={{ 
                      height: "600px",
                      width: "100%",
                      backgroundColor: "#d9e1e8",
                      border: "1px solid #ced4da", // Bootstrap's default border color
                      boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)", // Bootstrap's default focus shadow
                    }}
                    as="textarea"
                    defaultValue={props.evidence.join("\n\n")}
                    onChange={reviseEvidence}
                  />
                </div>
              </Form.Group>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExampleEvidence;
