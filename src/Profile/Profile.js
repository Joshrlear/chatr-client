import React, { Component } from 'react'
//import config from '../config'
import ChatContext from '../ChatContext';
//import fetches from '../fetches'

//const { getProfileImage, getProfilename } = fetches.profileFetches

const imageHeight = Math.ceil(window.outerHeight * 0.35);
const imageWidth = Math.ceil(window.innerWidth);

export default class Profile extends Component {
    constructor(props) {
      super(props)
      this.imageUpload = React.createRef()
      this.name = React.createRef()
      this.state = {
        user_id: '',
        profileImage: `https://via.placeholder.com/${imageWidth}x${imageHeight}`,
        name: '',
        imageUpload: 'Upload Image',
      }
    }

    //static contextType = UdownContext;
    
    componentDidMount() {
        
        // need to set localStorage: user_id

      /* this.setState({
        "user_id": localStorage.user_id
      }) */
    }

    componentDidUpdate() {
      /* const user_id = localStorage.user_id

      // get profile image
      const imageResult = Promise.resolve(getProfileImage(user_id, this.props))
      imageResult.then(value => {
        if (value.image) {
          const base64Image = value.image.image
          const image = `data:image/jpg;base64, ${base64Image}`
          value.image && (
            this.state.profileImage !== image  && (
              this.setState({
                profileImage: image
              })
            )
          )
          
        }
      })

      // get user phone_number
      const phoneResult = Promise.resolve(getProfilePhone(user_id, 'phone_number'))
      phoneResult.then(value => {
        if (value) {
          this.state.phone !== value.field && (
            this.setState({
              phone: value.field
            })
          )
        }
      }) */
    }

    handleSubmit = (e) => {
      e.preventDefault()
      /* const user_id = localStorage.user_id
      const imageUpload = this.imageUpload.current.files[0] ? this.imageUpload.current.files[0] : null
      const imageName = this.imageUpload.current.files[0] ? `${Date.now()}-${this.imageUpload.current.files[0].name}` : null
      const phoneNumber = this.phoneNumber.current.value && this.phoneNumber.current.value

      const formData = new FormData()
      this.imageUpload.current.files[0] && formData.append('image', imageUpload, imageName)
      formData.append('phone', phoneNumber)
      fetch(`${config.API_ENDPOINT}profile/${user_id}`, {
        method: 'POST',
        body: formData,
        headers: { "user_id": user_id }
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw err
          })
        }
        else {
          this.props.history.push('/profile')
          return res
        }
      })
      .catch(err => {
        console.log(err)
      }) */
    }

    handleInput = e => {
        e.preventDefault();
        const nameValue = e.target.value
        this.setState({
            name: nameValue
        })
        localStorage.username = nameValue
    }

    handleValue = () => {
      const imgName = this.imageUpload.current.value.split('fakepath\\')[1]
      this.setState({
        imageUpload: imgName
      })
    }

    render() {
        return (
          <div className="profile_container">
            <div className="profile">
                <div className="img_container">
                    <img id='profile-image' className="profile_image" src={this.state.profileImage} alt="User" />
                </div>
                <form ref='uploadForm' 
                  id='uploadForm' 
                  onSubmit={e => this.handleSubmit(e)}
                  method='post' 
                  encType="multipart/form-data">
                  <input 
                    ref={ this.imageUpload }
                    onChange={ this.handleValue } 
                    type="file" 
                    name="imageUpload"
                    id="imageUpload" />
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