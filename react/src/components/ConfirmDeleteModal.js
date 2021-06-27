import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function ConfirmDeleteModal(props) {
    if (!props.show) return <></>;
    
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>{`Are you sure you want to delete #${props.pokemon.id} - ${props.pokemon.name}?`}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant='danger' onClick={props.handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmDeleteModal;