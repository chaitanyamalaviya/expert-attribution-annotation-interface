import Textbox from "./Textbox"
import Likert from "./Likert"
import {Alert} from 'react-bootstrap';

const first = '1) Read the task description.'

const Task = (props) => {
    return (
        <div>
            <Alert style={{ width: '80%', marginTop: '20px', textAlign: 'left'}}> {first} </Alert> 
            <Textbox title="Task Description" text={props.task} />
            {/* <Textbox title="Answer" text={props.answer} />
            <Alert style={{ width: '80%', marginTop: '20px', textAlign: 'left'}}>
                <p> 2) Judge whether the answer is useful to the question. Usefulness should be 
                measured based on whether the answer is <b> at least partially answering the question. 
                </b> </p>
                <ol>
                    <li> Useful: Answers most/all of the question. </li>
                    <li> Partially useful: Answers a subset of the question, or answers the question partially. </li>
                    <li> Not useful at all: Completely irrelevant to what the question asked for. </li>
                </ol>
            </Alert> 
            <Likert title='Usefulness' options={['Useful', 'Partially useful', 'Not useful at all']} state={props.questionAnnotation} setState={props.setQuestionAnnotation} toChange='usefulness'/> */}
        </div>
    )
}

export default Task