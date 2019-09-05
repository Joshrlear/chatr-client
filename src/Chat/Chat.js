import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
//import UdownContext from '../UdownContext'
import ScrollToBottom from 'react-scroll-to-bottom'
import Textarea from 'react-textarea-autosize'
import './Chat.css'
import { IncomingMessage } from 'http';

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.chatInput = React.createRef()
        this.chatSection = React.createRef()
        this.messagesEnd = React.createRef()
        this.roomName = React.createRef()
        this.state = {
            currentMessage: '',
            messages: [],
            userTyping: [],
            roomName: '',
        }
    }

    //static contextType = UdownContext

    componentWillMount() {

        // connects to chat namespace 
        let chat = io(`${config.SERVER_BASE_URL}chat`)
        // listens for welcome message then logs to console
        chat.on('welcome', msg => {
            console.log(msg)
        })

        // client listens for 'news' socket then
        // logs the data emitted from 'news socket
        socket.on('news', data => {
            console.log(data);

            // client then emits 'my other event' socket
            // and sends object my: data to server
            socket.emit('my other event', { my: 'data' });
          })
         
        // client listens for 'incoming message' socket connection
        // then it logs the IncomingMsg  
        socket.on('incoming message', IncomingMsg => {
            console.log(IncomingMsg)
        })

        // connect to socket if no socket connected
        //!socket && (this.connectSocket())
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    componentWillUnmount() {

        // client emits 'disconnected' socket
        // when they leave the chat
        socket.emit('disconnected', localStorage.username)
    }

    /* connectSocket() {
        socket = io(config.API_ENDPOINT)
        socket.on('chat_message', msg => {
            this.setState({
                messages: [
                    ...this.state.messages, 
                    msg
                ]
            })
        })

        // displays: username is typing...
        socket.on('typing', user => {
            let timeout = null
            // if user not found in state
            if (this.state.userTyping.includes(user)) {
                // clear any previous timeout
                clearTimeout(timeout)
                // begin timeout
                timeout = setTimeout(() => {
                    
                    // after 3 seconds all usernames will be removed
                    this.setState({
                        userTyping: []
                    })
                }, 3000)
            }
            else {
                this.setState({
                    userTyping: [...this.state.userTyping, user]
                })
            }
        })
    } */

    closeChat = e => {
        e.preventDefault()
        console.log('closing chat')
        //this.context.closeChat()
    }

    handleRoomName = e => {
        e.preventDefault()
        const roomName = this.roomName.current.value
        const info = {
            roomName,
            'username': localStorage.username 
        }
        console.log(roomName)
        this.setState({
            roomName
        })
        socket.emit('joinRoom', info)
        socket.on('welcome message', message => {
            console.log(message)
        })
        socket.on('user joined room', message => {
            console.log(message)
        })
    }

    handleInput = (message) => {
        console.log('message here:',message)
        
        //socket.emit('typing', user)
        const messageInfo = {
            username: localStorage.username,
            message: message
        }

        this.setState({
            currentMessage: messageInfo
        })
    }

    sendMessage = e => {
        e.preventDefault()
        const newMsg = this.state.currentMessage
        const { username, message } = this.state.currentMessage
        const roomName = this.state.roomName
        const messageToRoom = {
            roomName,
            username,
            message
        }

        this.setState({
            messages: [...this.state.messages, newMsg]
        })
        //socket.emit('chat_message', ({ username: username, message: message}))
        this.chatInput.current.value = ''
        socket.emit('newMessage', messageToRoom )
        this.setState({
            currentMessage: ''
        })
    }

    render() {
        const chatToggle = !this.context.chatOpened ? 'chat_container' : 'chat_container active'
        return(
        <>
            <div className={ chatToggle }>
                <input ref={ this.roomName }/>
                <button onClick={ this.handleRoomName }>join room</button>
                <div className="chat_title_container">
                
                    {/* <button id="close_btn" className="close_btn" href="javascript:void(0)" onClick={e => this.closeChat(e)}><i className="fas fa-times fa-2x"></i></button> */}
                    <h1 className="chat_title">Chat</h1>
                </div>
                <ScrollToBottom className="chat_section">
                    <ul className="messages">
                        {this.state.messages.map((msg, i) => <li key={i} className="message">
                            <div  className="message_container">
                                <h3 className="from">{`${msg.username}:`}</h3>
                                <p className="message_text">{msg.message}</p>
                            </div>
                        </li>)}
                        {this.state.currentMessage && this.state.currentMessage.message && (<li key={0} className="preview">
                            <div  className="message_container">
                                <h3 className="from">{`${this.state.currentMessage.username}:`}</h3>
                                <p className="message_text">{this.state.currentMessage.message}</p>
                            </div>
                        </li>)}
                    </ul>
                    <ul className="users_typing">
                        {this.state.userTyping.map((user, i) => <li key={i} className="user_typing">
                            <p className="typing_msg"><em>{`${user} is typing...`}</em></p>
                        </li>)}
                    </ul>
                </ScrollToBottom>
                <div className="forScroll" ref={ this.messagesEnd }/>
                <form className="chat_input_section_container"
                onSubmit={e => {this.sendMessage(e)}}>
                    <div className="input_container">
                        <Textarea
                            maxRows={5}
                            ref={ this.chatInput } 
                            className="chat_intput" 
                            placeholder="type message..."
                            onChange={e => this.handleInput(e.target.value)}/>
                    </div>
                    <br/>
                    <div className="button_container">
                        <button 
                            className="send_button" 
                            type="submit">
                                Send
                        </button>
                    </div>
                    
                </form>
            </div>
            </>
    )
    }
}