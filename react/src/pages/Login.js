import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LinkContainer } from 'react-router-bootstrap';
import api from "../api";
import Alert from "react-bootstrap/Alert";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false);

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await api.login({username, password});
        if (response.ok) {
            const { token } = await response.json();
            sessionStorage.setItem('token', token);
            props.setLoggedIn(true);
        }
        else {
            setInvalid(true);
        }
    }

    return (
        <div className="Login" style={{ maxWidth: "40rem", margin: "4rem auto" }}>
            {invalid && (
                <Alert variant='warning'>
                    <Alert.Heading>Invalid username or password</Alert.Heading>
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
                <br></br>
                <Form.Label>Don't have a Pokemon account?  </Form.Label>
                <br></br>
                <LinkContainer to='/signup'>
                    <Button variant='secondary'>Sign up</Button>
                </LinkContainer>
            </Form>


        </div>
    );
}