import { useState } from "react";
import api from "../api";
import { Form, Label, Input, Button, FormGroup } from 'reactstrap';
import Button2 from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { LinkContainer } from "react-router-bootstrap";

const Create = (props) => {

    const [number, setTitle] = useState('');
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [type, setType] = useState([]);
    const [weakness, setWeakness] = useState([]);
    const [checked, setChecked] = useState(false);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [submittedValues, setSubmittedValues] = useState();

    const resetForm = () => {
        setTitle('');
        setName('');
        setHeight('');
        setWeight('');
        setType([]);
        setWeakness([]);
        setChecked(false);
        setFileName('');
    }

    const onChangeFile = e => {
        setFileName(e.target.files[0]);
    }

    const weaknessHandleChecked = ({ target }) => {
        setChecked(target.checked);
        let index;

        // check if the check box is checked or unchecked
        if (target.checked) {
            // add the numerical value of the checkbox to options array
            weakness.push(target.name);
            console.log(weakness);

        } else {
            // or remove the value from the unchecked checkbox from the array
            index = type.indexOf(+target.name);
            weakness.splice(index, 1)
            console.log(weakness);
        }
    }


    // function to detect checked boxes for Type and adds the name of the checkbox to type array, it will remove it if it's unchecked
    const handleChecked = ({ target }) => {
        setChecked(target.checked, checked.checked);

        let index;

        // check if the check box is checked or unchecked
        if (target.checked) {
            // add the numerical value of the checkbox to options array
            type.push(target.name);
            console.log(type);

        } else {
            // or remove the value from the unchecked checkbox from the array
            index = type.indexOf(+target.name);
            type.splice(index, 1)
            console.log(type);
        }
    }

    //Pending fetch
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e) => {
        //avoid refreshing the page on default
        e.preventDefault();


        // IMPORTANT: field names must match the web API expected field names exactly
        const newPokemon = { id: number, name, height, weight, type, weakness };

        console.log(newPokemon);
        console.log(type);
        setIsPending(true);
        // API functions return a response promise, so we await the promise resolving
        // Because any function that uses await must be async, the handleSubmit function has been made "async"
        const response = await api.addNewPokemon(newPokemon);
        const responseBody = await response.json();

        // Log the response body
        console.log(responseBody);
        console.log(fileName.name);

        if (response.status === 201) {
            //for image
            const formData = new FormData();
            formData.append("avatar", fileName);
            const token = sessionStorage.getItem('token');

            await fetch('http://localhost:8000/api/pokemon/avatar/' + newPokemon.id, {
                method: 'POST',
                headers: {
                    'X-Auth': token
                },
                body: formData
            });

            setSubmitted(true);
            setSubmittedValues({ ...newPokemon });
            resetForm();
        }
        else if (response.status === 401) {
            props.setLoggedIn(false);
        }
        else {
            setError(responseBody.message);
        }

        setIsPending(false);
    }

    const SubmittedMessage = () => {
        return (
            <Modal show={submitted} onHide={() => setSubmitted(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>#{submittedValues.id} - {submittedValues.name} added!</Modal.Title>
                </Modal.Header>
                <Modal.Body>You're a creative genius!</Modal.Body>
                <Modal.Footer>
                    <Button2 variant="secondary" onClick={() => setSubmitted(false)}>
                        Add Another
                    </Button2>
                    <LinkContainer to='/'>
                        <Button2 variant='primary'>
                            Home
                        </Button2>
                    </LinkContainer>
                </Modal.Footer>
            </Modal>
        );
    };

    const ErrorMessage = () => {
        return (
            <Modal show={error !== undefined} onHide={() => setError(undefined)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                    <Button2 variant="secondary" onClick={() => setError(undefined)}>
                        Try Again
                    </Button2>
                    <LinkContainer to='/'>
                        <Button2 variant='primary'>
                            Home
                        </Button2>
                    </LinkContainer>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div style={{ maxWidth: "40rem", margin: "4rem auto" }}>
            {submitted && submittedValues && <SubmittedMessage />}
            {error && <ErrorMessage />}

            <Form onSubmit={handleSubmit} id='addNewPokemonForm'>
                <FormGroup>
                    <Label>
                        Choose image:
                </Label>
                    <Input type="file" filename="avatar" onChange={onChangeFile} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="idToAdd">ID:</Label>
                    <Input type="number" required
                        value={number}
                        min='0'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="nameToAdd">Name:</Label>
                    <Input type="text" id='nameToAdd'
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="">Height (in):</Label>
                    <Input type='number' id='heightToAdd' min='0' step='0.1'
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="">Weight (lbs):</Label>
                    <Input type='number' id='weightToAdd' min='0' step='0.1'
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label>
                        Type:
                </Label>
                </FormGroup>
                <FormGroup check>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Normal" onChange={handleChecked} >{' '}</Input>
                        Normal
                    </Label>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fire" onChange={handleChecked} ></Input>
                        Fire
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Water" onChange={handleChecked} ></Input>
                        Water
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Grass" onChange={handleChecked} ></Input>
                        Grass
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Electric" onChange={handleChecked} ></Input>
                        Electric
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ice" onChange={handleChecked} ></Input>
                        Ice
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fighting" onChange={handleChecked} ></Input>
                        Fighting
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Poison" onChange={handleChecked} ></Input>
                        Poison
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ground" onChange={handleChecked} ></Input>
                        Ground
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Psychic" onChange={handleChecked} ></Input>
                        Flying
                    </Label>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Psychic" onChange={handleChecked} ></Input>
                        Psychic
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Bug" onChange={handleChecked} ></Input>
                        Bug
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Rock" onChange={handleChecked} ></Input>
                        Rock
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ghost" onChange={handleChecked} ></Input>
                        Ghost
                    </Label>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Dark" onChange={handleChecked} ></Input>
                        Dark
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Dragon" onChange={handleChecked} ></Input>
                        Dragon
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Steel" onChange={handleChecked} ></Input>
                        Steel
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fairy" onChange={handleChecked} ></Input>
                        Fairy
                    </Label>
                </FormGroup>

                <br></br>
                <FormGroup>
                    <Label>
                        Weakness:
                </Label>
                </FormGroup>
                <FormGroup check>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Normal" onChange={weaknessHandleChecked} ></Input>
                        Normal
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fire" onChange={weaknessHandleChecked} ></Input>
                        Fire
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Water" onChange={weaknessHandleChecked} ></Input>
                        Water
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Grass" onChange={weaknessHandleChecked} ></Input>
                        Grass
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Electric" onChange={weaknessHandleChecked} ></Input>
                        Electric
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ice" onChange={weaknessHandleChecked} ></Input>
                        Ice
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fighting" onChange={weaknessHandleChecked} ></Input>
                        Fighting
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Poison" onChange={weaknessHandleChecked} ></Input>
                        Poison
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ground" onChange={weaknessHandleChecked} ></Input>
                        Ground
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Psychic" onChange={weaknessHandleChecked} ></Input>
                        Flying
                    </Label>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Psychic" onChange={weaknessHandleChecked} ></Input>
                        Psychic
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Bug" onChange={weaknessHandleChecked} ></Input>
                        Bug
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Rock" onChange={weaknessHandleChecked} ></Input>
                        Rock
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Ghost" onChange={weaknessHandleChecked} ></Input>
                        Ghost
                    </Label>

                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Dark" onChange={weaknessHandleChecked} ></Input>
                        Dark
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Dragon" onChange={weaknessHandleChecked} ></Input>
                        Dragon
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Steel" onChange={weaknessHandleChecked} ></Input>
                        Steel
                    </Label>
                    <Label check style={{ marginRight: "2rem" }}>
                        <Input type='checkbox' name="Fairy" onChange={weaknessHandleChecked} ></Input>
                        Fairy
                    </Label>
                </FormGroup>

                <FormGroup>


                </FormGroup>

                {!isPending && <Button>Add Pokemon</Button>}
                {isPending && <Button disabled>Adding Pokemon</Button>}
            </Form>
        </div>
    );
}

export default Create;
