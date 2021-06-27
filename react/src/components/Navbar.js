import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavBar(props) {
    return (
        <Navbar bg='light' sticky='top' style={{boxShadow: '0rem -1rem 0.5rem 1rem grey'}}>
            <LinkContainer to='/'>
                <Navbar.Brand>
                    <img src='/pokeball.png'
                        width='30'
                        height='30'
                        alt='pokeball'
                        className='d-inline-block align-top'
                        />{' '}
                    The Pokémon Factory
                </Navbar.Brand>
            </LinkContainer>
            {props.loggedIn && (
                <Nav>
                    <LinkContainer to='/create'>
                        <Nav.Link>Create</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={() => props.setLoggedIn(false)}>
                        Logout
                    </Nav.Link>
                </Nav>
            )}
        </Navbar>
    );
}

export default NavBar;
