import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Player, BigPlayButton } from 'video-react'
import ChatContext from '../ChatContext'
import "../../node_modules/video-react/dist/video-react.css"
import './LandingPage.scss'
import config from '../config'

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
          <div className="landingpage_container main_container">
            <main className="landingpage">
              <header className="landingpage_header">
                <h1 className="title">Chatr</h1>
                <p className="subtitle">Blah, blah, blah...</p>
              </header>
              <div className="videoplayer_container">
              <iframe width="100%" height="230px" 
                src="https://www.youtube.com/embed/ZAUwiCv-5Mw" 
                frameBorder="0" 
                allow="accelerometer; 
                      autoplay; 
                      encrypted-media; 
                      gyroscope; 
                      picture-in-picture" 
                      allowFullScreen>
                </iframe>
              </div>
              <div className="enter_btn_container btn-2">
                <NavLink
                  to="/profile" 
                  className="enter_btn"
                >Enter</NavLink>
              </div>
              <section className="info_section">
                <article className="tech_used_contaier">
                  <h5 className="tech_used">React | Scss | Nodejs | Postgresql | Socket.io</h5>
                </article>
                <article className="summary_contaier">
                  <p className="summary">
                    Chatr is a chat app that is intended to mimic
                    real life conversation as well as adding some
                    digital flare.
                  </p>
                  <p className="future_updates">
                    In the future Chatr will feature things like
                    "sidechats". These are private messages inside
                    group conversations. No need to leave group to
                    start a new chatroom!
                  </p>
                </article>
                <article className="status_container">
                  <p className="status">Chatr is live with version 1.0</p>
                </article>
              </section>
              <footer className="footer">
                <a href="https://github.com/Joshrlear/chatr-client"><span className="fab fa-github-square fa-2x btn-1"/></a>
                <a href="https://www.facebook.com/josh.lear.7"><span className="fab fa-facebook-square fa-2x btn-1"/></a>
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer"><span className="fab fa-youtube-square fa-2x btn-1"/></a>
              </footer>
            </main>
          </div>
        )
    }
}