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

    componentWillMount() {
      console.log('logging here in profile')
    }

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
      console.log('Profile did mount')
      socket.on('changePointerEvents', value => {
        console.log('changing pointer event!', value)
        this.resetName()
      })
    }

    componentDidUpdate() {
      console.log('component is updating but does it have a username in state?')
      if (this.state.username) {
        const username = this.state.username
        const firstIntitial = Object.values(username).join()[0]
        console.log('this is the current state:', this.state, 'this.is the firstInitial to be updated with:', firstIntitial)
        this.state.firstIntitial !== firstIntitial
          && this.setState({
            firstIntitial
          })
      }
    }

    componentWillUnmount() {
      console.log('------//////////////// profile is unmounting!')
    }

    handleSubmit = (e) => {
      e && e.preventDefault()
      // set for quick access everywhere else
      const userName = this.state.username
      const inputName = this.state.name
      console.log('check if username is in use')
      if(inputName && userName !== inputName) {
        console.log('here', inputName && userName !== inputName)
        userName !== '' && socket.emit('disconnected', userName)
        getUser(inputName)
        .then(res => {
          console.log('checking to see if user exists:', inputName)
          //username not found
          if(!res.id) {
            console.log('no user found:', inputName)
            createUser(inputName)
              .then(user => {
                const { id, username } = user
                console.log('updating profile state with:', user)
                this.setState({
                  user_id: id,
                  username,
                })
                console.log('setting localstorage:', user)
                localStorage.user_id = id
                localStorage.username = username
                console.log('if true, we will go to /rooms', this.props.location.pathname !== "/rooms")
                this.props.location.pathname !== "/rooms" && this.props.history.push('/rooms')
                this.closeProfile()
              })
        }
        else {
          //username found
          const { id, username } = res
          console.log('user found:', username, id)
          this.setState({
            user_id: id,
            username,
          })
          console.log('setting localStorage from profile with:', username, id)
          localStorage.user_id = id
          localStorage.username = username
          console.log('if true, we will go to /rooms', this.props.location.pathname !== "/rooms")
          this.closeProfile()
          this.props.location.pathname !== "/rooms" && this.props.history.push('/rooms')
        }
        })
        .catch(err => {
          console.log(err)
        })
      }
      console.log('if true, we will go to /rooms', this.props.location.pathname !== "/rooms")
      this.closeProfile()
      this.props.location.pathname !== "/rooms" && this.props.history.push('/rooms')
    }

    updateInputValue = (input, event) => {
      const newState = {};
      newState[input] = event.target.value;
      this.setState(newState);
    };

    openProfile = e => {
      e.preventDefault()
      console.log('clicked')
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
      console.log('loggin here. Name should still be:', this.state.username)
      this.setState({
        name: this.state.username,
      }, () => this.closeProfile())
    }

    closeProfile = e => {
      console.log('check if the username has popualted the value yet:', this.state, this.state.profileOpen)
      this.state.profileOpen !== false
        &&  this.setState({
              profileOpen: false
            })
            console.log('closing profile and updating state:', this.state.profileOpen, 'name:', this.state.username)
    }

    render() {
      const currentPath = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1]
      const opened = this.state.profileOpen ? "open" : "closed"
      const hasUser = localStorage.user_id 
        && this.props.location.pathname !== "/profile" 
          ? "has_user" 
          : ""
        console.log(this.props.location.pathname)
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
                  </div>
                </form>
            </div>
          </>
        )
    }
}