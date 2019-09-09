import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
import AutosizeInput from 'react-input-autosize'
import ScrollToBottom from 'react-scroll-to-bottom'
//import UdownContext from '../UdownContext'
import fetches from '../fetches'
import Textarea from 'react-textarea-autosize'
import './Rooms.css'

// on render, client connects to socket.io via server
const socket = io.connect(config.SERVER_BASE_URL)

const { roomFetches, userRoomsFetches } = fetches

export default class Rooms extends Component {
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
            rooms_id: '',
        }
    }

    //static contextType = UdownContext

    componentWillMount() {
        console.log('logging in the Rooms component')
        !localStorage.user_id && this.props.history.push('/profile')
        localStorage.rooms_id && this.props.history.push('/chatroom')

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
        socket.on('incoming message', incomingMsg => {
            console.log(incomingMsg)
            this.setState({
                messages: [
                    ...this.state.messages, 
                    incomingMsg
                ]
            })

        })

        // connect to socket if no socket connected
        //!socket && (this.connectSocket())
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    componentWillUnmount() {
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

    addUserToSocketRoom = info => {
        socket.emit('joinRoom', info)
        socket.on('welcome message', message => {
            console.log(message)
        })
        socket.on('user joined room', message => {
            console.log(message)
        })
    }

    handleRoomName = e => {
        e.preventDefault()
        const roomName = this.state.roomName.replace(/\s+/g, '-').toLowerCase()
        const username = localStorage.username 
        const info = {
            roomName,
            username
        }

        console.log('this is the roomName and the username:', roomName, username)
        this.setState({
            roomName
        })

        // check whether roomName exists
        roomFetches.getRoom(roomName)
        .then(res => {
            console.log('determining if res is ok or not', res)
            if(!res.id) {
                // if room doesn't exists, create room
                console.log('room not found')
                roomFetches.createRoom(roomName)
                .then(res => {
                    console.log('res for roomName here:', res)
                    if(!res.id) {
                        throw new Error('Could not create room')
                    }
                    else {
                        // now room exists, add user to room
                        const rooms_id = res.id
                        const user_id = parseInt(localStorage.user_id)
                        console.log('room created:', rooms_id)
                        userRoomsFetches.addUser(user_id, rooms_id)
                        .then(res => {
                            console.log('this is the res:', res)
                            if(!res.ok) {
                                console.log('we are reaching this part')
                                throw new Error('user not added')
                            }
                            else {
                                // user has been added to room. update state with room_id
                                // and add to socket room
                                console.log('res is ok, we are now updating state with rooms_id')
                                this.setState({
                                    rooms_id
                                })
                                this.addUserToSocketRoom(info)
                                localStorage.rooms_id = rooms_id
                                this.props.history.push('/chatroom')
                                window.location.reload()
                            }
                        })
                    }
                })
                
            }
            else {
                console.log('res was good!', res)
                // if room exists, add user to room
                const rooms_id = res.id
                const user_id = localStorage.user_id
                console.log('room exists:', rooms_id)

                // check if user is already in room
                userRoomsFetches.getUserRooms(user_id, rooms_id)
                    .then(res =>{
                        console.log('this is the res from getuserRooms:', res)
                        if(!res.ok) {
                            console.log('are we getting here?')
                            // user not in room yet. add user
                            userRoomsFetches.addUser(user_id, rooms_id)
                                .then(res => {
                                    console.log('this is the res from addUser:', res)
                                   if(!res.ok) {
                                       console.log('this is running')
                                       throw new Error('user not added')
                                   }
                                   else {
                                       // user added to room. update state to 
                                       // show which room they are in
                                       // then add user to socket room
                                       console.log('Good res')
                                       this.setState({
                                           rooms_id
                                       })
                                       this.addUserToSocketRoom(info)
                                       localStorage.rooms_id = rooms_id
                                       this.props.history.push('/chatroom')
                                       window.location.reload()
                                   }
                                })
                                .catch(err => { return err })
                        }
                        else {
                            // user is in room. update state to show which 
                            // room they are in then add user to socket room
                            console.log('user already in room')
                            this.setState({
                                rooms_id
                            })
                            this.addUserToSocketRoom(info)
                            localStorage.rooms_id = rooms_id
                            this.props.history.push('/chatroom')
                            window.location.reload()
                        }
                    })
            }
        })
        .catch(err => { return err })  

        this.roomName.current.value = ''
    }

    updateInputValue = (input, event) => {
        const newState = {};
        newState[input] = event.target.value;
        this.setState(newState);
    };

    render() {
        
        return(
        <>
            <div className="rooms_container main_container">
            <form className="rooms_form" onSubmit={e => this.handleRoomName(e)}>
                  <AutosizeInput
                    ref={ this.roomName } 
                    className="input_roomName input-2" 
					placeholder="room name..."
					onChange={ this.updateInputValue.bind(this, 'roomName') }
				/>
                  <div className="button_rack">
                    <input className="save_btn btn-2" type='submit' value='Create Room' />
                  </div>
                </form>
                {/* <button onClick={ this.handleRoomName }>join room</button> */}
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
            </div>
            </>
    )
    }
}