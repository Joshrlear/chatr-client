import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import ChatContext from './ChatContext';
import LandingPage from './LandingPage/LandingPage'
import Profile from './Profile/Profile';
import Rooms from './Rooms/Rooms';
import Chatroom from './Chatroom/Chatroom'
import './App.css';
import config from './config';

let profilePath
let roomsPath
let chatRoomsPath

export default class App extends Component {
  state = {
    username: ''
  }

  checkLocalStorage = () => {
    let userInfo
    let key
    let value
    // if localStorage.username exists
    localStorage.username && (
      // not already in state
      this.state.username !== localStorage.username 
        && (userInfo = localStorage)
    )
    // set state for any available user info in localStorage
    userInfo && Object.entries(userInfo).map((entry, i) => {
      key = entry[0]
      value = entry[1]
      console.log(key, value)
      this.setState({
        [key]: value
      })
    })
  }

  // Allow profile to display if "profile" is somewhere in pathname
  profilePath = () => {
    const displayProfile = window.location.pathname.split('/').includes('profile')
    // if "/profile" is in pathname use pathname otherwise use "/profile"
    profilePath = displayProfile 
          ? (this.state.profilePath !== window.location.pathname) && this.setState({ profilePath: window.location.pathname })
          : (this.state.profilePath !== "/profile") && this.setState({ profilePath: "/profile" })
  }

  componentWillMount() {
    this.checkLocalStorage()
    this.profilePath()
  }

  componentWillUpdate() {
    this.checkLocalStorage()
    this.profilePath()
  }

  render() {

    const contextValue = {
      user: this.state.user,
    }
    //const isExact = this.state.profilePath !== "/profile" ? 'exact' : ''
    setTimeout(() => console.log(profilePath,roomsPath,chatRoomsPath), 0)
    return (
      <ChatContext.Provider value={ contextValue }>
        <div className="App">
          <Route
            exact
            path="/"
            component={ LandingPage }
          />
        <Route 
            path={ this.state.profilePath }
            component={ Profile }
          />
          <Route 
            path="/rooms"
            component={ Rooms }
          />
          <Route 
            path="/chatroom"
            component={ Chatroom }
          />
        </div>
        </ChatContext.Provider>
    );
  }
  
}
