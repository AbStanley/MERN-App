import { LinkContainer } from 'react-router-bootstrap';
import Alert from 'react-bootstrap/Alert';

function GenericErrorMessage(props) {
    return (
        <Alert variant='warning'>
            <Alert.Heading>Oops!</Alert.Heading>
            Something went wrong.{' '}
            <LinkContainer to='/'><Alert.Link>Click here</Alert.Link></LinkContainer>{' '}
            to go back.
        </Alert>
    );
}

export default GenericErrorMessage;