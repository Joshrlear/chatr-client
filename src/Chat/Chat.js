import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
//import UdownContext from '../UdownContext'
import ScrollToBottom from 'react-scroll-to-bottom'
import Textarea from 'react-textarea-autosize'
import './Chat.css'

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.chatInput = React.createRef()
        this.chatSection = React.createRef()
        this.messagesEnd = React.createRef()
        this.chatRoom = React.createRef()
        this.state = {
            currentMessage: '',
            messages: [],
            userTyping: [],
            chatRoom: '',
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
        // then it logs the newMsg  
        socket.on('incoming message', newMsg => {
            console.log(newMsg)
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

    handleChatRoom = e => {
        e.preventDefault()
        const chatRoom = this.chatRoom
        
        this.setState({
            chatRoom
        })
        socket.emit('joinRoom', chatRoom)
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
        
        this.setState({
            messages: [...this.state.messages, newMsg]
        })
        //socket.emit('chat_message', ({ username: username, message: message}))
        this.chatInput.current.value = ''
        socket.emit('newMessage', newMsg )
        this.setState({
            currentMessage: ''
        })
    }

    render() {
        const chatToggle = !this.context.chatOpened ? 'chat_container' : 'chat_container active'
        return(
        <>
            <div className={ chatToggle }>
                <input ref={ this.chatRoom }/>
                <button onClick={ this.handleChatRoom }>join room</button>
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