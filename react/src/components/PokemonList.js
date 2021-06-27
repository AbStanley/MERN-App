import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';
import { AnimationWrapper } from 'react-hover-animation';

function PokemonList(props) {
    const imgStyle = {
        margin: '1rem', 
        width: 'inherit',
        maxHeight: '10rem', 
        objectFit: 'scale-down',
        border: '1px solid black',
        background: 'white'
    };

    return (
        <Container>
            <Row>
                {props.pokemon.map(p => {
                    const imageSrc = p.avatarPath ? `http://localhost:8000/${p.avatarPath}` : '/pokeball.png';

                    return (
                        <Col xl={3} lg={4} sm={6} key={p.id}>
                            <LinkContainer to={`/pokemon/${p.id}`} style={{cursor: 'pointer', margin: '1rem'}}>
                                <AnimationWrapper>
                                    <Card border='dark' bg='light' text='dark'>
                                        <Card.Img variant='top' src={imageSrc} style={imgStyle}/>
                                        <Card.Body>
                                            <Card.Title>{p.name}</Card.Title>
                                            <Card.Subtitle>#{p.id}</Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </AnimationWrapper>
                            </LinkContainer>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    )
}

export default PokemonList;