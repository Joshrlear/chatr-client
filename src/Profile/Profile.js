import React, { Component } from 'react'
import io from 'socket.io-client'
import config from '../config'
import ChatContext from '../ChatContext'
import AutosizeInput from 'react-input-autosize'
import OutsideClickHandler from 'react-outside-click-handler'
import fetches from '../fetches'
import './Profile.css'

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

const { createUser, getUser } = fetches.userFetches
const { userLeavesRoom } = fetches.userRoomsFetches

export default class Profile extends Component {
    constructor(props) {
      super(props)
      this.name = React.createRef()
      this.state = {
        user_id: '',
        name: '',
        username: '',
        firstIntitial: '',
        profileOpen: false,
        pointerEvent: false,
        inputActive: false
      }
    }

    static contextType = ChatContext

    componentDidMount() {
      let username
      let user_id

      if (localStorage.username) {
        username = localStorage.username
        user_id = localStorage.user_id
        const firstIntitial = Object.values(username).join()[0]
        this.state.username !== username
          && this.setState({
            firstIntitial,
            name: username,
            username,
            user_id
          })
      }
      const connection_id = this.context.componentConnection
      socket.emit('connect to components', connection_id)
      socket.on('changePointerEvents', value => {
        this.state.profileOpen && this.resetName()
      })
    }

    componentDidUpdate() {
      if (this.state.username) {
        const username = this.state.username
        const firstIntitial = Object.values(username).join()[0]
        this.state.firstIntitial !== firstIntitial
          && this.setState({
            firstIntitial
          })
      }
    }

    updateUserRooms = userRooms => {
      this.props.location.pathname === "/chatroom" 
        && socket.emit('update userRooms', this.state.user)
    }

    handleSubmit = (e) => {
      e && e.preventDefault()
      // set for quick access everywhere else
      const userName = this.state.username
      const inputName = this.state.name
      const connection_id = this.context.componentConnection
      const pathname = this.props.location.pathname
      // user is on the main profile
      if(pathname === "/profile") {
        // user already logged in
        if(inputName && userName === inputName) {
          this.closeProfile()
          this.props.history.push("/rooms")
        }

      }

      if(inputName && userName !== inputName) {
        getUser(inputName)
        .then(res => {
          console.log(res.id)
          //username not found
          if(!res.id) {
            createUser(inputName)
              .then(user => {
                const { id, username } = user
                this.setState({
                  user_id: id,
                  username,
                })
                localStorage.user_id = id
                localStorage.username = username
                if(pathname === "/profile") {
                  this.closeProfile()
                  this.props.history.push("/rooms")
                }
                else {
                  const userLeavingInfo = {
                    user_id: id,
                    username,
                    connection_id
                  }
                  console.log('here1')
                  socket.emit('userLeavesRoom', userLeavingInfo)
                  const info = { username: userName, roomName: localStorage.roomName }
                  localStorage.roomName && socket.emit('leaveRoom', info)
                  this.closeProfile()
                }
              })
        }
        else {
          //username found
          const { id, username } = res
          this.setState({
            user_id: id,
            username,
          })
          localStorage.user_id = id
          localStorage.username = username
          if(pathname === "/profile") {
            this.closeProfile()
            this.props.history.push("/rooms")
          }
          else {
            const userLeavingInfo = {
              user_id: id,
              username,
              connection_id
            }
            console.log('here2')
            socket.emit('userLeavesRoom', userLeavingInfo)
            const info = { username: userName, roomName: localStorage.roomName }
            localStorage.roomName && socket.emit('leaveRoom', info)
            this.closeProfile()
          }
        }})
      }
    }

    updateInputValue = (input, event) => {
      const newState = {};
      newState[input] = event.target.value;
      this.setState(newState);
    };

    openProfile = e => {
      e.preventDefault()
      this.state.profileOpen !== true
        &&  this.setState({
              profileOpen: true
            })
      this.state.inputActive !== true
        && this.setState({
          inputActive: true
        })
    }

    resetName = e => {
      this.setState({
        name: this.state.username,
      }, () => this.closeProfile())
    }

    closeProfile = e => {
      this.state.profileOpen !== false
        &&  this.setState({
              profileOpen: false
            })
    }
    
    logout = () => {
      const { user_id, rooms_id } = localStorage
      userLeavesRoom(user_id, rooms_id)
      localStorage.clear()
      this.context.updateAppState()
      this.props.history.push('/')

    }

    render() {
      const currentPath = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1]
      const opened = this.state.profileOpen ? "open" : "closed"
      const hasUser = localStorage.user_id 
        && this.props.location.pathname !== "/profile" 
          ? "has_user" 
          : ""
        const usernameVal = this.state.profileOpen 
          ? this.state.name 
          : this.props.location.pathname === "/profile" || "/"
            ? this.state.username 
            : this.state.firstIntitial
        return (
          <>
            <div 
              className={`profile_container ${hasUser} ${opened} main_container ${currentPath}`}
              onClick={e => e.target.classList.contains("open") && this.resetName(e)}
              >
                <form className={`profile_form ${hasUser}`} onSubmit={e => this.handleSubmit(e)}>
                <OutsideClickHandler onOutsideClick={() => {
                   this.state.inputActive && this.setState({ inputActive: false })}}>
                    <AutosizeInput
                      ref={ this.name } 
                      className={`profile_name ${hasUser} ${this.state.inputActive && opened} input-1`}
				            	placeholder={ this.state.name || "Name here..." }
                      value={ usernameVal }
                      onChange={this.updateInputValue.bind(this, 'name')}
                      onClick={e => currentPath && this.openProfile(e)}
				            />
                  </OutsideClickHandler>
                  <div className={`button_rack ${hasUser}`}>
                    <input
                      onClick={e => currentPath && this.resetName(e)}
                      className={`cancel_btn ${hasUser} btn-0`} 
                      type='button' 
                      value='Cancel' 
                    />
                    <input disabled={ this.state.name.length < 1 } className="save_btn btn-1" type='submit' value='Save' />
                    <input
                      onClick={e => this.logout()}
                      className={`logout_btn ${hasUser} btn-3`} 
                      type='button' 
                      value='Logout' 
                    />
                  </div>
                </form>
            </div>
          </>
        )
    }
}