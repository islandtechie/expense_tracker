import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import GlobalState from './context/GlobalState';
import MainNav from './components/MainNav';
import Index from './components/Index';
import Register from './components/Register';
import Home from './components/Home';
import Account from './components/Account';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GlobalState>
        <div className="App">
            <Router>
                <header className="main-header">
                    <MainNav />
                </header>
                <div className="container">
                    <Switch>
                        <ProtectedRoute exact path="/account" component={Account} />
                        <ProtectedRoute exact path="/home" component={Home} />
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/">
                            <Index  />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    </GlobalState>
  );
}

export default App;
