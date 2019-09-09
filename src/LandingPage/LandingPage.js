import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class LandingPage extends Component {
    constructor(props) {
      super(props)
      this.state = {

      }
    }

    render() {
        return (
          <div className="profile_container">
            <h1>Landing Page</h1>
            <NavLink to="/profile">Profile</NavLink>
            <br/>
            <NavLink to="/rooms">Rooms</NavLink>
          </div>
        )
    }
}