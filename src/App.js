import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from './Home';
import Movie from './Movie';
import Navigation from './Navigation';
import Exchange from './Exchange';
import Converter from './Converter';
import Footer from './Footer';



import './App.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/exchangerate" component={Exchange} />
        <Route path="/converter" component={Converter} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;