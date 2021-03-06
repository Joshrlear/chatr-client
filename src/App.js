import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ChatContext from './ChatContext';
import uuid from 'react-uuid'
import LandingPage from './LandingPage/LandingPage'
import Profile from './Profile/Profile';
import Rooms from './Rooms/Rooms';
import Chatroom from './Chatroom/Chatroom'
import './App.css';

export default class App extends Component {
  state = {
    user_id: '',
    username: '',
    rooms_id: '',
    roomName: '',
    componentConnection: uuid(),
    profilePath: '/',
  }

  updateRoomName = (info) => {
    const roomName = info.roomName
    this.state.roomName !== roomName
      && this.setState({
        roomName
      })
  }

  updateState = userInfo => {
    let key
    let value
    const { user_id, username, rooms_id, roomName } = this.state
    const userState = { user_id, username, rooms_id, roomName }
    userState !== userInfo 
      && Object.entries(userInfo).map((entry, i) => {
          key = entry[0]
          value = entry[1]
          this.setState({
            [key]: value
          })
        })
  }

  updateAppState = () => {
    this.profilePath()

    const userState = [
      this.state.user_id, 
      this.state.username, 
      this.state.rooms_id, 
      this.state.roomName
    ]
    const storedUser = [
      localStorage.user_id == null ? "" : localStorage.user_id, 
      localStorage.username == null ? "" : localStorage.username, 
      localStorage.rooms_id == null ? "" : localStorage.rooms_id, 
      localStorage.roomName == null ? "" : localStorage.roomName
    ]

    const isEqual = JSON.stringify(userState) === JSON.stringify(storedUser)
    if (!isEqual) {
        this.setState({
          user_id: storedUser[0],
          username: storedUser[1],
          rooms_id: storedUser[2],
          roomName: storedUser[3]
        })
    }
  }


  profilePath = () => {
    const profilePath = window.location.pathname === "/" ? "/profile" : "/"
    profilePath !== this.state.profilePath
      && this.setState({ profilePath })
  }

  componentWillMount() {
    this.updateAppState()
  }

  componentWillUpdate() {
    this.updateAppState()
  }

  componentDidMount() {
    if (!localStorage.componentConnection) {
      localStorage.componentConnection = this.state.componentConnection
    }
  }

  render() {
    
    const { user_id, username, rooms_id, roomName } = this.state
    const contextValue = {
      user: {
        user_id,
        username,
        rooms_id,
        roomName,
      },
      updateRoomName: this.updateRoomName,
      updateState: this.updateState,
      updateAppState: this.updateAppState,
      componentConnection: this.state.componentConnection
    }
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
