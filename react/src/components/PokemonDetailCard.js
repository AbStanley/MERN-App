import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';

function PokemonDetailCard(props) {
    const pokemon = props.pokemon;
    
    const getHeight = (h) => `${Math.floor(h/12)}' ${Math.floor(h%12)}"`;
    const getWeight = (w) => `${w} lbs`;
    const getType = (ts) => ts.map((t, index) => index === 0 ? t : `, ${t}`);

    const imageSrc = pokemon.avatarPath ?
            `http://localhost:8000/${pokemon.avatarPath}` : '/pokeball.png';
    const height = pokemon.height ? getHeight(pokemon.height) : 'Unknown';
    const weight = pokemon.weight ? getWeight(pokemon.weight) : 'Unknown';
    const type = pokemon.type.length > 0 ? getType(pokemon.type) : 'Unknown';
    const weakness = pokemon.weakness.length > 0 ? getType(pokemon.weakness) : 'Unknown';

    return (
        <Card>
            <Card.Img variant="top" src={imageSrc} style={{ maxHeight: '50vh', objectFit: 'scale-down' }} />
            <Card.Body>
                <Card.Title>{pokemon.name}</Card.Title>
                <Card.Text>#{pokemon.id}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>Height: {height}</ListGroupItem>
                <ListGroupItem>Weight: {weight}</ListGroupItem>
                <ListGroupItem>
                    Type: {type}
                </ListGroupItem>
                <ListGroupItem>
                    Weakness: {weakness}
                </ListGroupItem>
            </ListGroup>
            <Card.Body>
                <Container>
                    <Row className='justify-content-between'>
                        <LinkContainer to={`/edit/${pokemon.id}`}>
                            <Button variant='primary'>
                                Edit
                            </Button>
                        </LinkContainer>
                
                        <Button variant='danger' onClick={props.confirmDelete}>
                            Delete
                        </Button>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default PokemonDetailCard;