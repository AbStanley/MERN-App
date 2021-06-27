import Alert from 'react-bootstrap/Alert';
import api from '../api';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Container from 'react-bootstrap/Container';
import GenericErrorMessage from '../components/GenericErrorMessage';
import { LinkContainer } from 'react-router-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import PokemonDetailCard from '../components/PokemonDetailCard';
import PrevNextNav from '../components/PrevNextNav';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Detail(props) {
    // Using the 'useParams' hook, get the id of the Pokemon to display from the URL
    // (Documentation: https://reactrouter.com/web/example/url-params)
    const { id } = useParams();

    // Use hooks to fetch data from API, then render the element when data is loaded
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-do-data-fetching-with-hooks
    // https://reactjs.org/docs/hooks-effect.html

    const initialState = {
        initializing: true,
        pokemon: undefined,
        loading: false,
        notFound: false,
        error: false,
        deleted: false,
        deletedRequested: false,
        showConfirmModal: false,
    }

    const [state, setState] = useState(initialState);

    useEffect(() => {
        // Gets data about the pokemon of interest from the web API
        async function fetchData() {
            setState(prevState => ({...prevState, loading: true}));

            try {
                const response = await api.getPokemonById(id);
                if (response.ok) {
                    const p = await response.json();
                    setState(prevState => ({...prevState, pokemon: p}));
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

        // Deletes a pokemon via the web API
        async function doDelete() {
            setState(prevState => ({...prevState, loading: true}));

            let response = await api.deletePokemon(id);
            if (response.status === 204) 
                setState(prevState => ({...prevState, deleted: true}));
            else if (response.status === 401)
                props.setLoggedIn(false);

            setState(prevState => ({...prevState, loading: false, deleteRequested: false}));
        }


        if (state.initializing) fetchData();
        if (state.deleteRequested) doDelete();

    }, [id, state, props]); // useEffect


    // Local handlers
    const confirmDelete = () => { 
        setState(prevState => ({...prevState, showConfirmModal: true})); 
    };
    const handleClose = () => { 
        setState(prevState => ({...prevState, showConfirmModal: false})); 
    };
    const handleDelete = () => { 
        setState(prevState => ({...prevState, showConfirmModal: false, deleteRequested: true})); 
    };
    const resetState = () => { 
        setState(initialState);
    };


    // Local function components
    const BreadcrumbHeader = () => (
        <Breadcrumb>
            <LinkContainer to='/'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </LinkContainer>
            <Breadcrumb.Item active>
                #{state.pokemon === undefined ? id : `${id} - ${state.pokemon.name}`}
            </Breadcrumb.Item>
        </Breadcrumb>
    );
    const NotFound = () => (
        <Alert variant='warning'>
            <Alert.Heading>Pokémon #{id} not found.</Alert.Heading>
            <LinkContainer to='/'><Alert.Link>Click here</Alert.Link></LinkContainer>{' '}
            to go back.
        </Alert>
    );
    const Deleted = () => (
        <Alert variant='success'>
            <Alert.Heading>Pokémon #{id} deleted</Alert.Heading>
            <LinkContainer to='/'>
                <Alert.Link>Click here</Alert.Link>
            </LinkContainer>
            {' '}to go back.
        </Alert>
    );
    

    // Set main content for page based on state
    let mainContent;

    if (state.error)
        mainContent = <GenericErrorMessage />
    else if (state.initializing || state.loading)
        mainContent = <LoadingSpinner />;
    else if (state.notFound)
        mainContent = <NotFound />;
    else if (state.deleted)
        mainContent = <Deleted />;
    else
        mainContent = <PokemonDetailCard pokemon={state.pokemon} confirmDelete={confirmDelete}/>;


    // Render
    return (
        <>
            {/* Only shows when showConfirmModal is set to true */}
            <ConfirmDeleteModal show={state.showConfirmModal} pokemon={state.pokemon}
                handleClose={handleClose} handleDelete={handleDelete}/>

            <BreadcrumbHeader />
            <PrevNextNav id={id} onNav={resetState} initializing={state.initializing}/>

            <Container fluid style={{ maxWidth: '30rem', marginBottom: '2rem' }}>
                {mainContent}
            </Container>
        </>
    );
}


export default Detail;
