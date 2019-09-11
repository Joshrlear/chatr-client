import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ChatContext from '../ChatContext'

export default class LandingPage extends Component {
    constructor(props) {
      super(props)
      this.state = {

      }
    }

    static contextType = ChatContext

    componentWillMount() {
      console.log('landing page here!', ChatContext.user_id, ChatContext.rooms_id)
      if (ChatContext.user_id) {
          ChatContext.rooms_id
            ? this.props.history.push('/chatroom')
            : this.props.history.push('/rooms')
      }
    }

    render() {
        return (
          <div className="main_container">
            <h1>Landing Page</h1>
            <NavLink to="/profile">Profile</NavLink>
            <br/>
            <NavLink to="/rooms">Rooms</NavLink>
          </div>
        )
    }
}