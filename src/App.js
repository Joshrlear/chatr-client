import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ChatContext from './ChatContext';
import uuid from 'react-uuid'
import LandingPage from './LandingPage/LandingPage'
import Profile from './Profile/Profile';
import Rooms from './Rooms/Rooms';
import Chatroom from './Chatroom/Chatroom'
import './App.css';

let profilePath
let roomsPath
let chatRoomsPath

export default class App extends Component {
  state = {
    user_id: '',
    username: '',
    rooms_id: '',
    roomName: '',
    componentConnection: uuid()
  }

  updateRoomName = (info) => {
    const roomName = info.roomName
    console.log('updating roomName!', roomName)
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
          console.log(key, value)
          this.setState({
            [key]: value
          })
        })
  }

  checkLocalStorage = () => {
    console.log('checking local storage')

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

    const isEqual = JSON.stringify(userState) == JSON.stringify(storedUser)
    console.log(JSON.stringify(userState), JSON.stringify(storedUser), isEqual)
    if (!isEqual) {
        this.setState({
          user_id: storedUser[0],
          username: storedUser[1],
          rooms_id: storedUser[2],
          roomName: storedUser[3]
        })
    }
  }

  // Allow profile to display if "profile" is somewhere in pathname
  profilePath = () => {
    /* const displayProfile = window.location.pathname.split('/').includes('profile')
    // if "/profile" is in pathname use pathname otherwise use "/profile"
    profilePath = displayProfile 
          ? (this.state.profilePath !== window.location.pathname) && this.setState({ profilePath: window.location.pathname })
          : (this.state.profilePath !== "/profile") && this.setState({ profilePath: "/profile" }) */

    this.state.user_id
      ? this.state.profilePath === '/' && this.setState({ profilePath: '/' })
      : this.state.profilePath === '/profile' && this.setState({ profilePath: '/profile' })
  }

  componentWillMount() {
    console.log('App will mount')
    this.checkLocalStorage()
    //window.location.pathname !== '/home' && window.location.replace(`${config.CLIENT_BASE_URL}home`)
  }

  componentWillUpdate() {
    console.log('App will update')
    this.checkLocalStorage()
  }

  componentDidMount() {
    if (!localStorage.componentConnection) {
      localStorage.componentConnection = this.state.componentConnection
      /* this.setState({
        componentConnection: connection_id
      }) */
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
      checkLocalStorage: this.checkLocalStorage,
      componentConnection: this.state.componentConnection
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
            path="/"
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
