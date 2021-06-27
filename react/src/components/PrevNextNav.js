import api from '../api';
import { BsFillCaretLeftFill } from 'react-icons/bs';
import { BsFillCaretRightFill } from 'react-icons/bs';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from 'react';

function PrevNextNav(props) {
    const id = props.id;
    const initializing = props.initializing;

    const [ids, setIds] = useState();

    useEffect(() => {
        async function fetchData() {

            // get the ids of all pokemon in DB
            try {
                const response = await api.getAllPokemon();
                const ps = await response.json();
                setIds(ps.map(p => p.id));
            }
            catch {}
        }

        if (initializing) {
            fetchData();
        }
    }, [id, initializing]);


    if (ids === undefined) return <></>

    const currentIndex = ids.indexOf(parseInt(id));
    const lastIndex = ids.length - 1;

    // Wrapping
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;
    const nextIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;

    const prevId = ids[prevIndex];
    const nextId = ids[nextIndex];

    return (
        <Container fluid  style={{maxWidth: '30rem'}}>
            <Nav className='justify-content-between'>
                <Nav.Item>
                    <LinkContainer to={`/pokemon/${prevId}`} onClick={props.onNav}>
                        <Nav.Link>
                            <BsFillCaretLeftFill />Previous
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to={`/pokemon/${nextId}`} onClick={props.onNav}>
                        <Nav.Link>
                            Next<BsFillCaretRightFill />
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
            </Nav>
        </Container>
    );
}

export default PrevNextNav;