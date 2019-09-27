import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
import ChatContext from '../ChatContext'
import fetches from '../fetches'
import ScrollToBottom from 'react-scroll-to-bottom'
import Textarea from 'react-textarea-autosize'
import './Chatroom.css'
import moment from 'moment'

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
            newUserMsg: [],
            userTyping: [],
            roomName: '',
            rooms_id: '',
            username: '',
            user_id: '',
            mounted: false
        }
    }

    static contextType = ChatContext

    componentWillMount() {
        // check to see if user and room are defined
        const pathname = this.props.location.pathname.includes('/profile') ? this.props.location.pathname : "/profile"
        !localStorage.user_id && this.props.history.push(pathname)
        !localStorage.rooms_id && this.props.history.push('/rooms')
        let { user_id, username, rooms_id, roomName } = localStorage
        const storedUserInfo = { user_id, username, rooms_id, roomName }
        this.context.updateState(storedUserInfo)

        // update state with user info
        const userId = user_id
        const userName = username
        const roomsId = rooms_id
        const room_name = roomName;
        ({ user_id, username, rooms_id, roomName } = this.state)
        const userInfo = [user_id, username, rooms_id, roomName]
        const localUserInfo = [userId, userName, roomsId]
        userInfo !== localUserInfo
            && this.setState({
                    user_id: userId,
                    username: userName,
                    rooms_id: roomsId,
                    roomName: room_name
                })
    }

    // remove from userTyping array
    clearUserTyping = (user, typingTimeout) => {
        const PATTERN = user,
            filtered = this.state.userTyping.filter(function (arr) { 
                return arr.indexOf(PATTERN) === -1; 
            });
            this.setState({
                userTyping: filtered
            })
            // clear timeout
            typingTimeout && clearTimeout(typingTimeout)
    }

    componentDidMount() {
        // trigger app rerender
        this.context.updateAppState()
        const { username, roomName } = this.state
        const info = { username, roomName }
        socket.emit('joinRoom', info)
        socket.on('user joined room', message => {
            this.setState({
                newUserMsg: [...this.state.newUserMsg, message.message]
            })
        })

        // connect to componentConnection socket room
        const connection_id = this.context.componentConnection
        socket.emit('connect to components', connection_id)
        socket.on('userLeavesRoom', userInfo => {
            // leave room then update state
            this.state.mounted === true && this.leaveRoom()
        })

        // client listens for 'incoming message' socket connection
        // then it logs the IncomingMsg  
        socket.on('incoming message', incomingMsg => {
            this.setState({
                messages: [
                    ...this.state.messages, 
                    incomingMsg
                ]
            })
        })
    
        let typingTimeout = null

        socket.on('stop typing', user => {
            this.clearUserTyping(user, typingTimeout)
        })

        // displays: username is typing...
        socket.on('typing', user => {
            // if user not found in state
            if (this.state.userTyping.includes(user)) {
                
                clearTimeout(typingTimeout)
                // begin timeout
                typingTimeout = setTimeout(() => {
                    // after 3 seconds all usernames will be removed
                    this.clearUserTyping(user)
                }, 3000)
            }
            else {
                this.setState({
                    userTyping: [...this.state.userTyping, user]
                })
            }
        })

        this.state.mounted !== true
            && this.setState({
                mounted: true
            })
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    componentWillUnmount() {
        const { username, roomName } = this.state
        const info = { username, roomName }
        socket.emit('leaveRoom', info)
    }

    leaveRoom = (e) => {
        this.changePointerEvents()
        this.state.mounted !== false
            && this.setState({
                mounted: false
            })
        const { user_id } = this.state
        const { rooms_id } = this.state
        userRoomsFetches.userLeavesRoom(user_id, rooms_id)
            .then(res => {
                if(res.ok) {
                    // client emits 'disconnected' socket
                    // when they leave the chat
                    const userLeaving = {
                        username: this.state.username,
                        roomName: this.state.roomName
                    }
                    socket.emit('disconnected', userLeaving)
                }
            })
            .then(() => {
                localStorage.removeItem('rooms_id')
            })
            .then(() => {
                localStorage.removeItem('roomName')
            })
            .then(() => {
                // update app state to reflect that user left room
               this.context.updateAppState()
            })
            .then(() => {
                 this.props.history.push('/rooms')
            })
    }

    handleInput = (value) => {
        if (!value) {
            const { roomName } = this.state
            const message = this.textarea.value
            const info = {
                user: this.state.username,
                roomName
            }
            socket.emit('typing', info)
            const messageInfo = {
                username: this.state.username,
                message: message
            }

            this.setState({
                currentMessage: messageInfo
            })
        }
        else {
            this.sendMessage(value)
        }
    }

    sendMessage = e => {
        e.preventDefault()
        if (this.state.currentMessage.message) {
            this.changePointerEvents()
            const newMsg = this.state.currentMessage
            newMsg.timestamp = moment().format('h:mm a').toString()
            const { username, message } = this.state.currentMessage
            const roomName = this.state.roomName
            const messageToRoom = {
                roomName,
                username,
                message,
                timestamp: this.state.currentMessage.timestamp,
            }

            this.setState({
                messages: [...this.state.messages, newMsg]
            })
            this.textarea.value = ''
            socket.emit('newMessage', messageToRoom )
            this.setState({
                currentMessage: ''
            })
            const info = {
                user: username,
                roomName
            }
            socket.emit('stop typing', info)
        }
    }

    changePointerEvents = () => {
        const value = {
            event: true,
            connection_id: this.context.componentConnection
        }
        socket.emit('changePointerEvents', value)
    }

    render() {
        
        return(
        <div className="chatroom_container main_container">
            <header className="room_header">
                <h1>{this.state.roomName}</h1>
                <button className="btn-3" onClick={e => this.leaveRoom(e)}>Leave</button>
            </header>
            <section className="message_section">
                <ScrollToBottom className="message_container">
                    <ul className="messages">
                        {this.state.messages.map((msg, i) => 
                            <li key={i} className={`message_wrap ${msg.username !== this.state.username ? "not_me" : "me"}`}>
                                <div className="message">
                                    <h5 className="from">{`${msg.username}:`}</h5>
                                    <p className="message_text">{msg.message}</p>
                                    <h6 className="time_sent">{ msg.timestamp }</h6>
                                </div>
                            </li>
                        )}
                        {this.state.currentMessage && this.state.currentMessage.message && (<li key={0} className="preview_wrap me">
                            <div className="preview">
                                <h5 className="from"><em>Preview</em></h5>
                               <p className="message_text">{this.state.currentMessage.message}</p>
                               <h6 className="time_sent"><em>pending</em></h6>
                            </div>
                        </li>)}
                    </ul>
                    <ul className="users_typing">
                        {this.state.userTyping.map((user, i) => <li key={i} className="user_typing">
                            <p className="typing_msg"><em>{`${user} is typing . . .`}</em></p>
                        </li>)}
                    </ul>
                </ScrollToBottom>
            </section>
                <div className="forScroll" ref={ this.messagesEnd }/>
                {/* <section name="user input" className="user_input_section"> */}
                    <form className="chat_input_section_container"
                        onSubmit={e => {this.sendMessage(e)}}>
                        <div className="input_container">
                            <Textarea
                                maxRows={4}
                                inputRef={ tag => (this.textarea = tag) }
                                className="chat_intput" 
                                placeholder="type message..."
                                onChange={e => this.handleInput()}
                                onKeyDown={e => e.key === "Enter" && this.handleInput(e)}
                                onClick={e => this.changePointerEvents()}
                            />
                        </div>
                        <br/>
                        <div className="button_container">
                            <button 
                                disabled={ !this.state.currentMessage || this.state.currentMessage.message === '' }
                                className="send_button btn-4" 
                                type="submit">
                                    Send
                            </button>
                        </div>
                    </form>
                {/* </section> */}
        </div>
    )
    }
}