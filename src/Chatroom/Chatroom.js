import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
import ChatContext from '../ChatContext'
import fetches from '../fetches'
import ScrollToBottom from 'react-scroll-to-bottom'
import Textarea from 'react-textarea-autosize'
import Moment from 'react-moment'
import './Chatroom.css'
import moment from 'moment'

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

const { roomFetches, userRoomsFetches } = fetches

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
            username: '',
            user_id: ''
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
        console.log(user_id, username, rooms_id, roomName)
        /* roomFetches.getRoomById(rooms_id)
            .then(res => {
                console.log('this is the res from getroombyid', res)
                if (!res.name) {
                    throw new Error('could not get room name')
                }
                else {
                    const roomName = res.name
                    res.name !== this.state.roomName
                        && this.setState({ roomName })
                }
            }) */

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
            console.log(filtered)
            this.setState({
                userTyping: filtered
            })
            // clear timeout
            typingTimeout && clearTimeout(typingTimeout)
    }

    componentDidMount() {
        // trigger app rerender
        this.context.checkLocalStorage()
        const { username, roomName } = this.state
        const info = { username, roomName }
        console.log('///////', info)
        socket.emit('joinRoom', info)
        socket.on('welcome message', message => {
            console.log(message)
        })
        socket.on('user joined room', message => {
            console.log(message)
        })

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
    
        let typingTimeout = null

        socket.on('stop typing', user => {
            console.log('trying to clear typing', user)
            this.clearUserTyping(user, typingTimeout)
        })

        // displays: username is typing...
        socket.on('typing', user => {
            // if user not found in state
            if (this.state.userTyping.includes(user)) {
                
                clearTimeout(typingTimeout)
                // begin timeout
                typingTimeout = setTimeout(() => {
                    console.log('//////////this is logging too')
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
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    leaveRoom = e => {
        console.log('user leaving room')
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
            // remove then update app state
            const next = Promise.resolve(localStorage.removeItem('rooms_id'))
            const updateAppState = next && localStorage.removeItem('roomName')
            // trigger app rerender
            updateAppState && this.context.checkLocalStorage()
            this.props.history.push('/rooms')
    }

    handleInput = (message) => {
        console.log('message here:',message)
        const user = this.state.username
        socket.emit('typing', user)
        const messageInfo = {
            username: this.state.username,
            message: message
        }

        this.setState({
            currentMessage: messageInfo
        })
    }

    sendMessage = e => {
        e.preventDefault()
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
        socket.emit('stop typing', username)
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
                            <p className="typing_msg"><em>{`${user} is typing...`}</em></p>
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
                {/* </section> */}
        </div>
    )
    }
}