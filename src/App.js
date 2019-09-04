import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import ChatContext from './ChatContext';
import Profile from './Profile/Profile';
import Chat from './Chat/Chat';
import './App.css';

export default class App extends Component {
  state = {
    user: ""
  }

  render() {

    const contextValue = {
      user: this.state.user,
    }

    return (
      <ChatContext.Provider value={ contextValue }>
        <div className="App">
          <section className="link_container">
            <NavLink
              activeClassName="active"
              to="/profile"
            >Profile
            </NavLink>
            <NavLink
              activeClassName="active"
              to="/chat"
            >Chat
            </NavLink>
          </section>
          
          <Route 
            exact
            path="/profile"
            component={ Profile }
          />
          <Route 
            path="/chat"
            component={ Chat }
          />
        </div>
        </ChatContext.Provider>
    );
  }
  
}
