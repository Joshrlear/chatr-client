import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
//import UdownContext from '../UdownContext'
import fetches from '../fetches'
import ScrollToBottom from 'react-scroll-to-bottom'
import Textarea from 'react-textarea-autosize'
import './Chatroom.css'

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

const { userRoomsFetches } = fetches

export default class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef()
        this.state = {
            currentMessage: '',
            messages: [],
            userTyping: [],
            roomName: '',
            rooms_id: '',
        }
    }

    //static contextType = UdownContext

    componentWillMount() {
        const pathname = this.props.location.pathname.includes('/profile') ? this.props.location.pathname : "/profile"
        !localStorage.user_id && this.props.history.push(pathname)
        !localStorage.rooms_id && this.props.history.push('/rooms')
        // client listens for 'incoming message' socket connection
        // then it logs the IncomingMsg  
        socket.on('incoming message', incomingMsg => {
            console.log(incomingMsg)
            this.setState({
                messages: [
                    ...this.state.messages, 
                    incomingMsg
                ]
            })

        })
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    leaveRoom = e => {
        const user_id = localStorage.user_id
        const { rooms_id } = this.state
        userRoomsFetches.userLeavesRoom(user_id, rooms_id)
            .then(res => {
                if(res.ok) {
                    console.log('user has left room and will disconnect from socket room:',res)
                    // client emits 'disconnected' socket
                    // when they leave the chat
                    socket.emit('disconnected', localStorage.username)
                }
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
        this.textarea.value = ''
        socket.emit('newMessage', messageToRoom )
        this.setState({
            currentMessage: ''
        })
    }

    render() {
        
        return(
        <div className="chatroom_container main_container">
            <header className="room_header">
                <h1>room-name</h1>
                <button className="btn-3" onClick={ this.leaveRoom }>Leave</button>
            </header>
            <section className="message_section">
                <ScrollToBottom className="message_container">
                    <ul className="messages">
                        {this.state.messages.map((msg, i) => <li key={i} className="message">
                            <div  className="message">
                                <h3 className="from">{`${msg.username}:`}</h3>
                                <p className="message_text">{msg.message}</p>
                            </div>
                        </li>)}
                        {this.state.currentMessage && this.state.currentMessage.message && (<li key={0} className="preview">
                            <div  className="message">
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
            </section>
                <div className="forScroll" ref={ this.messagesEnd }/>
                <form className="chat_input_section_container"
                    onSubmit={e => {this.sendMessage(e)}}>
                    <div className="input_container">
                        <Textarea
                            maxRows={5}
                            inputRef={ tag => (this.textarea = tag) }
                            className="chat_intput" 
                            placeholder="type message..."
                            onChange={e => this.handleInput(e.target.value)}/>
                    </div>
                    <br/>
                    <div className="button_container">
                        <button 
                            className="send_button btn-4" 
                            type="submit">
                                Send
                        </button>
                    </div>
                    
                </form>
        </div>
    )
    }
}