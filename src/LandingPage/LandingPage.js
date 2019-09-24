import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ChatContext from '../ChatContext'
import { Player } from 'video-react'
import './LandingPage.css'

export default class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.handleValueChange = this.handleValueChange.bind(this);
    this.updatePlayerInfo = this.updatePlayerInfo.bind(this);
    this.state = {
      videoHeight: '230px',
      playerSource: '../videos/chatrDemo.mp4'
    }
  }

  static contextType = ChatContext

  componentWillMount() {
    if (ChatContext.user_id) {
        ChatContext.rooms_id
          ? this.props.history.push('/chatroom')
          : this.props.history.push('/rooms')
    }
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      let videoHeight = window.innerWidth > "500" && window.innerWidth < "785" ? "100%" : '230px'
      this.setState({ videoHeight })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.playerSource !== prevState.playerSource) {
      this.player.load();
    }
  }

  handleValueChange(e) {
    const { value } = e.target;
    this.setState({
      inputVideoUrl: value
    });
  }

  updatePlayerInfo() {
    const { inputVideoUrl } = this.state;
    this.setState({
      playerSource: inputVideoUrl
    });
  }

  // https://youtu.be/ZAUwiCv-5Mw
  // https://www.youtube.com/watch?v=ZAUwiCv-5Mw
  render() {
      return (
        <div className="landingpage_container main_container">
          <main className="landingpage">
            <div className="mobile_grid1">
              <header className="landingpage_header">
                <h1 className="title">Chatr</h1>
                <p className="subtitle">Blah, blah, blah...</p>
              </header>
              <div className="videoplayer_container">
              {/* <iframe width="100%" height={ this.state.videoHeight }
                title="Chatr demonatration video"
                src="https://www.youtube.com/embed/ZAUwiCv-5Mw" 
                frameBorder="0" 
                allow="accelerometer; 
                      autoplay; 
                      encrypted-media; 
                      gyroscope; 
                      picture-in-picture" 
                      allowFullScreen>
                </iframe> */}
                <Player
                  ref={player => { this.player = player }}
                  videoId="video-1">
                  <source src={this.state.playerSource} />
                </Player>
              </div>
            </div>
            <div className="mobile_grid2">
            <header className="landingpage_header_shortToWide">
                <h1 className="title">Chatr</h1>
                <p className="subtitle">Blah, blah, blah...</p>
              </header>
              <div className="enter_btn_container btn-2">
                <NavLink
                  to="/profile" 
                  className="enter_btn"
                >Enter</NavLink>
              </div>
              <section className="info_section">
                <article className="tech_used_contaier">
                  <h5 className="tech_used">React</h5>
                  <h5 className="tech_used">Scss</h5>
                  <h5 className="tech_used">Nodejs</h5>
                  <h5 className="tech_used">Postgresql</h5>
                  <h5 className="tech_used">Socket.io</h5>
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
                <a href="https://github.com/Joshrlear/chatr-client" target="_blank" rel="noopener noreferrer"><span className="fab fa-github-square fa-2x btn-1"/></a>
                <a href="https://www.facebook.com/josh.lear.7" target="_blank" rel="noopener noreferrer"><span className="fab fa-facebook-square fa-2x btn-1"/></a>
                <a href="https://www.youtube.com/watch?v=ZAUwiCv-5Mw" target="_blank" rel="noopener noreferrer"><span className="fab fa-youtube-square fa-2x btn-1"/></a>
              </footer>
            </div>
          </main>
        </div>
      )
  }
}