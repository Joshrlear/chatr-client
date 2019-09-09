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
                this.setState({
                  name_input: '',
                  user_id: id,
                  user: username
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

    render() {
      const hasUser = localStorage.user_id 
        && this.props.location.pathname !== "/profile" 
          ? "has_user" 
          : ""

        return (
          <>
            <div className={`profile_container ${hasUser} main_container`}>
                <form className={`profile_form ${hasUser}`} onSubmit={e => this.handleSubmit(e)}>
                  <AutosizeInput
                    ref={ this.name } 
                    className={`profile_name ${hasUser} input-1`}
				          	placeholder={ this.state.name || "Name here..." }
				          	value={this.state.name}
				          	onChange={this.updateInputValue.bind(this, 'name')}
				          />
                  <div className={`button_rack ${hasUser}`}>
                    <input className={`cancel_btn ${hasUser} btn-1`} type='button' value='Cancel' />
                    <input className="save_btn btn-1" type='submit' value='Save' />
                  </div>
                </form>
            </div>
          </>
        )
    }
}