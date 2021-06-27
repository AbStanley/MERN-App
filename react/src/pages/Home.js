import { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import PokemonList from '../components/PokemonList'
import Container from 'react-bootstrap/Container'
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import GenericErrorMessage from '../components/GenericErrorMessage';
import Alert from 'react-bootstrap/Alert';

function Home(props) {
    // Use hooks to fetch data from API, then render the element when data is loaded
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-do-data-fetching-with-hooks
    // https://reactjs.org/docs/hooks-effect.html

    const [state, setState] = useState({
        pokemon: undefined,
        loading: false,
        notFound: false,
        error: false,
    });

    useEffect(() => {
        // Get the data for all pokemon
        async function fetchData() {
            setState(prevState => ({...prevState, loading: true}));

            try {
                const response = await api.getAllPokemon();
                if (response.ok) {
                    const ps = await response.json();
                    setState(prevState => ({...prevState, pokemon: ps}));
                }
                else if (response.status === 404)
                    setState(prevState => ({...prevState, notFound: true}));
                else if (response.status === 401)
                    props.setLoggedIn(false);
                else throw Error();
            }
            catch { setState(prevState => ({...prevState, error: true})); }
            
            setState(prevState => ({...prevState, loading: false}));
        }

        fetchData();
    }, [props]);


    // Local function components
    const NotFound = () => (
        <Alert variant='warning'>
            <Alert.Heading>No Pokémon exist yet.</Alert.Heading>
            Why don't you{' '}
            <LinkContainer to='/create'><Alert.Link>create some</Alert.Link></LinkContainer>?
        </Alert>
    );


    // Set main content of page based on state
    let mainContent;

    if (state.loading)
        mainContent = <LoadingSpinner />
    else if (state.pokemon)
        mainContent = <PokemonList pokemon={state.pokemon}/>
    else if (state.notFound)
        mainContent = <NotFound />;
    else
        mainContent = <GenericErrorMessage />;

    
    // Render
    return (
        <>
            <Container style={{marginTop: '2rem'}}>
                <h1 style={{textAlign: 'center', margin: '2rem'}} className='display-4'>Home</h1>
                {mainContent}
            </Container>
        </>
    );
}

export default Home;
