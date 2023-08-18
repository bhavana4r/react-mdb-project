import React from 'react';
import './App.css';
import { Dashboard } from './Dashboard.tsx';
import { USerLogin } from './UserLogin';
import {BrowserRouter as Router,Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Router>
        <Switch>
          <Route exact path='/' component={USerLogin}/>
          <Route  path='/dashboard' component={Dashboard}/>
        </Switch>
     </Router>
       
    </div>
  );
}

export default App;
