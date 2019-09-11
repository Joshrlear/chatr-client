import React, { Component } from 'react'
import config from '../config'
import AutosizeInput from 'react-input-autosize'
import ChatContext from '../ChatContext';
import fetches from '../fetches'
import './Profile.css'

const { createUser, getUser } = fetches.userFetches

export default class Profile extends Component {
    constructor(props) {
      super(props)
      this.name = React.createRef()
      this.state = {
        user_id: '',
        name: '',
        firstIntitial: '',
        profileOpen: false
      }
    }

    componentWillMount() {
      let name
      let user_id
      
      if (localStorage.username) {
        name = localStorage.username
        user_id = localStorage.user_id
        this.state.user !== name
          && this.setState({
            name, 
            user_id
          })
      }
    }

    handleSubmit = (e) => {
      e.preventDefault()
      // set for quick access everywhere else
      const username = this.state.name
      console.log('check if username is in use')
      getUser(username)
        .then(res => {
          //username not found
          if(!res.id) { 
            createUser(username)
              .then(user => {
                const { id, username } = user
                const firstIntitial = Object.value(username)[1]
                this.setState({
                  name_input: '',
                  user_id: id,
                  user: username,
                  firstIntitial
                })
                localStorage.user_id = id
                localStorage.username = username
              })
              this.props.history.push('/rooms')
        }
        else {
          //username found
          const { id, username } = res
          localStorage.user_id = id
          localStorage.username = username
          this.props.history.push('/rooms')
        }
        })
        .catch(err => {
          console.log(err)
        })
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
      e.preventDefault()
      console.log('clicked')
      this.state.profileOpen !== false
        &&  this.setState({
              profileOpen: false
            })
    }

    render() {
      const currentPath = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1]
      const opened = this.state.profileOpen ? "open" : ""
      const hasUser = localStorage.user_id 
        && this.props.location.pathname !== "/profile" 
          ? "has_user" 
          : ""

        return (
          <>
            <div className={`profile_container ${hasUser} ${opened} main_container ${currentPath}`}>
                <form className={`profile_form ${hasUser}`} onSubmit={e => this.handleSubmit(e)}>
                  <AutosizeInput
                    ref={ this.name } 
                    className={`profile_name ${hasUser} input-1`}
				          	placeholder={ this.state.name || "Name here..." }
				          	value={this.state.name}
                    onChange={this.updateInputValue.bind(this, 'name')}
                    onClick={e => this.openProfile(e)}
				          />
                  <div className={`button_rack ${hasUser}`}>
                    <input
                      onClick={e => this.closeProfile(e)}
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