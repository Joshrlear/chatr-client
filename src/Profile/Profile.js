import React, { Component } from 'react'
import io from 'socket.io-client'
import config from '../config'
import ChatContext from '../ChatContext'
import AutosizeInput from 'react-input-autosize'
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
        pointerEvent: false
      }
    }

    static contextType = ChatContext

    componentWillMount() {
      console.log('logging here in profile')
      let username
      let user_id
      
      if (localStorage.username) {
        username = localStorage.username
        user_id = localStorage.user_id
        this.state.username !== username
          && this.setState({
            name: username,
            username,
            user_id
          })
      }
    }

    componentDidMount() {
      const connection_id = this.context.componentConnection
      socket.emit('connect to components', connection_id)
      console.log('Profile did mount')
      socket.on('changePointerEvents', value => {
        console.log('changing pointer event!', value)
        this.closeProfile()
      })
    }

    handleSubmit = (e) => {
      e && e.preventDefault()
      // set for quick access everywhere else
      const userName = this.state.username
      const inputName = this.state.name
      console.log('check if username is in use')
      if(userName !== inputName) {
        this.closeProfile()
        socket.emit('disconnected', userName)
        getUser(inputName)
        .then(res => {
          //username not found
          if(!res.id) { 
            createUser(inputName)
              .then(user => {
                const { id, username } = user
                const firstIntitial = Object.values(username).join()
                this.setState({
                  user_id: id,
                  username,
                  firstIntitial
                })
                localStorage.user_id = id
                localStorage.username = username
              })
              this.props.location.pathname !== "/rooms" && this.props.history.push('/rooms')
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
          this.props.location.pathname !== "/rooms" && this.props.history.push('/rooms')
        }
        })
        .catch(err => {
          console.log(err)
        })
      }
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
    }

    closeProfile = e => {
      e && e.preventDefault()
      console.log('clicked')
      this.state.profileOpen !== false
        &&  this.setState({
              profileOpen: false
            })
    }

    render() {
      const currentPath = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1]
      const opened = this.state.profileOpen ? "open" : "closed"
      const hasUser = localStorage.user_id 
        && this.props.location.pathname !== "/profile" 
          ? "has_user" 
          : ""

        return (
          <>
            <div 
              className={`profile_container ${hasUser} ${opened} main_container ${currentPath}`}
              onClick={e => e.target.classList.contains("open") && this.closeProfile(e)}
              >
                <form className={`profile_form ${hasUser}`} onSubmit={e => this.handleSubmit(e)}>
                  <AutosizeInput
                    ref={ this.name } 
                    className={`profile_name ${hasUser} input-1`}
				          	placeholder={ this.state.name || "Name here..." }
				          	value={ this.state.name }
                    onChange={this.updateInputValue.bind(this, 'name')}
                    onClick={e => currentPath && this.openProfile(e)}
				          />
                  <div className={`button_rack ${hasUser}`}>
                    <input
                      onClick={e => currentPath && this.closeProfile(e)}
                      className={`cancel_btn ${hasUser} btn-0`} 
                      type='button' 
                      value='Cancel' 
                    />
                    <input className="save_btn btn-1" type='submit' value='Save' />
                  </div>
                </form>
            </div>
          </>
        )
    }
}