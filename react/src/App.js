import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import Detail from './pages/Detail';
import Edit from './pages/Edit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <Router>
            {/* The site header used on all pages */}
            <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

            <Switch>
                <Route exact path='/'>
                    {!loggedIn ? <Redirect to='/login' /> : <Home setLoggedIn={setLoggedIn}/>}
                </Route>
                <Route exact path='/create'>
                    {!loggedIn ? <Redirect to='/login' /> : <Create /> }
                </Route>
                <Route exact path='/edit/:id'>
                    {!loggedIn ? <Redirect to='/login' /> : <Edit setLoggedIn={setLoggedIn}/>}
                </Route>
                <Route exact path='/login'>
                    {loggedIn ? <Redirect to='/' /> : <Login setLoggedIn={setLoggedIn}/>}
                </Route>
                <Route exact path='/signup'>
                    {loggedIn ? <Redirect to='/' /> : <Signup />}
                </Route>
                {/* :id is a URL parameter */}
                <Route path='/pokemon/:id'>
                    {!loggedIn ? <Redirect to='/login' /> : <Detail setLoggedIn={setLoggedIn}/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
