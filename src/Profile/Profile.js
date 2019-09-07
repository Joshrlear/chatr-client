import React, { Component } from 'react'
import config from '../config'
import ChatContext from '../ChatContext';
import fetches from '../fetches'

const { createUser, getUser } = fetches.userFetches

export default class Profile extends Component {
    constructor(props) {
      super(props)
      this.name = React.createRef()
      this.state = {
        name_input: '',
        user_id: '',
        name: '',
      }
    }

    handleSubmit = (e) => {
      e.preventDefault()
      // set for quick access everywhere else
      const username = this.state.name_input
      console.log('check if username is in use')
      getUser(username)
        .then(res => {
          //username not found
          if(!res.id) { 
            createUser(username)
              .then(user => {
                const { id, username } = user
                this.setState({
                  name_input: '',
                  user_id: id,
                  user: username
                })
                localStorage.user_id = id
                localStorage.username = username
                this.name.current.value = ''
              })
        }
        else {
          //username found
          const { id, username } = res
          localStorage.user_id = id
          localStorage.username = username
          this.name.current.value = ''
        }
        })
        .catch(err => {
          console.log(err)
        })
    }

    handleInput = e => {
        e.preventDefault();
        const name_input = e.target.value
        this.setState({
            name_input
        })
    }

    render() {
        return (
          <div className="profile_container">
            <div className="profile">
                <form onSubmit={e => this.handleSubmit(e)}>
                  <label className="name_label">Name</label>
                  <input 
                    ref={ this.name } 
                    className="name" 
                    placeholder="Name here" 
                    defaultValue={ this.state.name }
                    onChange={ e => this.handleInput(e) }
                  />
                  <div className="button_rack">
                    <input className="save_btn" type='submit' value='Save' />
                  </div>
                </form>
            </div>
          </div>
        )
    }
}