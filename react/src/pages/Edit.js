import { useEffect, useState } from "react";
import api from "../api";
import { Form, Label, Input, Button, FormGroup } from 'reactstrap';
import Button2 from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router";
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Container from "react-bootstrap/Container";

const Edit = (props) => {
    const { id } = useParams();

    const initialState = {
        initializing: true,
        loading: false,
        notFound: false,
        error: false,
        updated: false,
        showConfirmModal: false,
    }

    const [state, setState] = useState(initialState);
    const [pokemon, setPokemon] = useState();
    const [fileName, setFileName] = useState();

    useEffect(() => {
        // Gets data about the pokemon of interest from the web API
        async function fetchData() {
            setState(prevState => ({...prevState, loading: true}));

            try {
                const response = await api.getPokemonById(id);
                if (response.ok) {
                    const p = await response.json();
                    setPokemon(p);
                }
                else if (response.status === 404)
                    setState(prevState => ({...prevState, notFound: true}));
                else if (response.status === 401)
                        props.setLoggedIn(false);
                else throw Error();
            }
            catch { setState(prevState => ({...prevState, error: true})); }

            setState(prevState => ({...prevState, loading: false, initializing: false}));
        }

        if (state.initializing) fetchData();
    }, [id, state, props]); // useEffect

    const onChangeFile = e => {
        setFileName(e.target.files[0]);
    }

    const weaknessHandleCheck = (e) => {
        if (e.target.checked) {
            setPokemon(prev => ({...prev, weakness: prev.weakness.concat(e.target.name)}));
        } else {
            setPokemon(prev => ({...prev, weakness: prev.weakness.filter(el => el !== e.target.name)}));
        }
    }

    const typeHandleCheck = (e) => {
        if (e.target.checked) {
            setPokemon(prev => ({...prev, type: prev.type.concat(e.target.name)}));
        } else {
            setPokemon(prev => ({...prev, type: prev.type.filter(el => el !== e.target.name)}));
        }
    }

    const handleSubmit = async (e) => {
        //avoid refreshing the page on default
        e.preventDefault();
        setState(prev => ({...prev, loading: true}));
        
        const response = await api.updatePokemon(pokemon);
        if (response.status === 204) {
            if (fileName) {
                const formData = new FormData();
                formData.append("avatar", fileName);
                const token = sessionStorage.getItem('token');
    
                await fetch('http://localhost:8000/api/pokemon/avatar/' + pokemon.id, {
                    method: 'POST',
                    headers: {
                        'X-Auth': token
                    },
                    body: formData
                });
            }
            setState(prev => ({...prev, updated: true}));
        }
        else {
            setState(prev => ({...prev, error: 'An unknown error occurred.'}));
        }
        
        setState(prev => ({...prev, loading: false}));
    }

    // Local function components
    const BreadcrumbHeader = () => (
        <Breadcrumb>
            <LinkContainer to='/'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </LinkContainer>
            <LinkContainer to={`/pokemon/${id}`}>
                <Breadcrumb.Item>#{pokemon === undefined ? id : `${id} - ${pokemon.name}`}</Breadcrumb.Item>
            </LinkContainer>
            <Breadcrumb.Item active>
                Edit
            </Breadcrumb.Item>
        </Breadcrumb>
    );
    const UpdatedMessage = () => (
        <Modal show={state.updated}>
            <Modal.Header>
                <Modal.Title>#{pokemon.id} - {pokemon.name} updated!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Way to go!</Modal.Body>
            <Modal.Footer>
                <LinkContainer to='/'>
                    <Button2 variant='secondary'>
                        Home
                    </Button2>
                </LinkContainer>
                <LinkContainer to={`/pokemon/${pokemon.id}`}>
                    <Button2 variant='primary'>
                        Go Back
                    </Button2>
                </LinkContainer>
            </Modal.Footer>
        </Modal>
    );
    const ErrorMessage = () => (
            <Modal show={state.error !== undefined} onHide={() => setState(prev => ({...prev, error: undefined}))}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{state.error}</Modal.Body>
                <Modal.Footer>
                    <Button2 variant="secondary" onClick={() => setState(prev => ({...prev, error: undefined}))}>
                        Try Again
                    </Button2>
                    <LinkContainer to='/'>
                        <Button2 variant='primary'>
                            Home
                        </Button2>
                    </LinkContainer>
                </Modal.Footer>
            </Modal>
    );

    return (
        <>
        <BreadcrumbHeader />
        <Container style={{ maxWidth: "40rem", margin: "2rem auto" }}>
            {state.updated && <UpdatedMessage />}
            {state.error && <ErrorMessage />}
            {pokemon && (
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
                            value={pokemon.id}
                            min='0'
                            disabled
                            onChange={(e) => setPokemon(prev => ({...prev, id: e.target.value}))}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="nameToAdd">Name:</Label>
                        <Input type="text" id='nameToAdd'
                            value={pokemon.name}
                            required
                            onChange={(e) => setPokemon(prev => ({...prev, name: e.target.value}))}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="">Height (in):</Label>
                        <Input type='number' id='heightToAdd' min='0' step='0.1'
                            value={pokemon.height}
                            onChange={(e) => setPokemon(prev => ({...prev, height: e.target.value}))}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="">Weight (lbs):</Label>
                        <Input type='number' id='weightToAdd' min='0' step='0.1'
                            value={pokemon.weight}
                            onChange={(e) => setPokemon(prev => ({...prev, weight: e.target.value}))} />
                    </FormGroup>

                    <FormGroup>
                        <Label>
                            Type:
                    </Label>
                    </FormGroup>
                    <FormGroup check>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Normal" onChange={typeHandleCheck} >{' '}</Input>
                            Normal
                        </Label>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fire" onChange={typeHandleCheck} ></Input>
                            Fire
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Water" onChange={typeHandleCheck} ></Input>
                            Water
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Grass" onChange={typeHandleCheck} ></Input>
                            Grass
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Electric" onChange={typeHandleCheck} ></Input>
                            Electric
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ice" onChange={typeHandleCheck} ></Input>
                            Ice
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fighting" onChange={typeHandleCheck} ></Input>
                            Fighting
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Poison" onChange={typeHandleCheck} ></Input>
                            Poison
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ground" onChange={typeHandleCheck} ></Input>
                            Ground
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Psychic" onChange={typeHandleCheck} ></Input>
                            Flying
                        </Label>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Psychic" onChange={typeHandleCheck} ></Input>
                            Psychic
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Bug" onChange={typeHandleCheck} ></Input>
                            Bug
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Rock" onChange={typeHandleCheck} ></Input>
                            Rock
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ghost" onChange={typeHandleCheck} ></Input>
                            Ghost
                        </Label>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Dark" onChange={typeHandleCheck} ></Input>
                            Dark
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Dragon" onChange={typeHandleCheck} ></Input>
                            Dragon
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Steel" onChange={typeHandleCheck} ></Input>
                            Steel
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fairy" onChange={typeHandleCheck} ></Input>
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
                            <Input type='checkbox' name="Normal" onChange={weaknessHandleCheck} ></Input>
                            Normal
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fire" onChange={weaknessHandleCheck} ></Input>
                            Fire
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Water" onChange={weaknessHandleCheck} ></Input>
                            Water
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Grass" onChange={weaknessHandleCheck} ></Input>
                            Grass
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Electric" onChange={weaknessHandleCheck} ></Input>
                            Electric
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ice" onChange={weaknessHandleCheck} ></Input>
                            Ice
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fighting" onChange={weaknessHandleCheck} ></Input>
                            Fighting
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Poison" onChange={weaknessHandleCheck} ></Input>
                            Poison
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ground" onChange={weaknessHandleCheck} ></Input>
                            Ground
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Psychic" onChange={weaknessHandleCheck} ></Input>
                            Flying
                        </Label>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Psychic" onChange={weaknessHandleCheck} ></Input>
                            Psychic
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Bug" onChange={weaknessHandleCheck} ></Input>
                            Bug
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Rock" onChange={weaknessHandleCheck} ></Input>
                            Rock
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Ghost" onChange={weaknessHandleCheck} ></Input>
                            Ghost
                        </Label>

                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Dark" onChange={weaknessHandleCheck} ></Input>
                            Dark
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Dragon" onChange={weaknessHandleCheck} ></Input>
                            Dragon
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Steel" onChange={weaknessHandleCheck} ></Input>
                            Steel
                        </Label>
                        <Label check style={{ marginRight: "2rem" }}>
                            <Input type='checkbox' name="Fairy" onChange={weaknessHandleCheck} ></Input>
                            Fairy
                        </Label>
                    </FormGroup>

                    <FormGroup />

                    {!state.loading && <Button>Update</Button>}
                    {state.loading && <Button disabled>Updating...</Button>}
                </Form>
            )}
        </Container>
        </>
    );
}

export default Edit;
