import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import GlobalState from './context/GlobalState';

function App() {
  return (
    <GlobalState>
      <div className="App">
        <Router>
          <header className="main-header">
              <p>Hello</p>
          </header>
        </Router>
      </div>
    </GlobalState>
  );
}

export default App;
