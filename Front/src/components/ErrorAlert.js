import Alert from 'react-bootstrap/Alert';
import {useEffect, useState} from "react";

const ErrorAlert = (props) => {

    // const [heading, setHeading] = useState(props.heading)
    // const [content, setContent] = useState(props.content)


    useEffect(() => {
        const timer = setTimeout(() => {
            props.onClose();
        }, 3000); // 3000 milliseconds (3 seconds)

        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, []);
    //
    // useEffect(() => {
    //     setContent(props.content)
    //     setHeading(props.heading)
    // }, [props.content, props.heading]);

    return <>
        <Alert variant={"danger"} onClose={props.onClose}  dismissible>

            <Alert.Heading>
                {props.heading}
            </Alert.Heading>

            <p>
                {props.content}
            </p>

        </Alert>
    </>
}


export default ErrorAlert;