import React, { Component } from 'react'
import config from '../config'
import io from 'socket.io-client'
import AutosizeInput from 'react-input-autosize'
import ChatContext from '../ChatContext'
import fetches from '../fetches'
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
            roomName: '',
            rooms_id: []
        }
    }

    static contextType = ChatContext

    componentWillMount() {
        this.context.checkLocalStorage()
        console.log('logging in the Rooms component', this.context.user)
        !localStorage.user_id && this.props.history.push('/profile')
        localStorage.rooms_id && console.log('component will mount and this is the rooms_id:', localStorage.rooms_id) /* this.props.history.push('/chatroom') */

        // connects to chat namespace 
        let chat = io(`${config.SERVER_BASE_URL}chat`)
        // listens for welcome message then logs to console
        chat.on('welcome', msg => {
            console.log(msg)
        })
    }

    componentDidMount() {
        roomFetches.getAllRooms()
            .then(res => {
                if (res.length > 0) {
                    console.log('here are all the rooms!', res)
                    this.setState({
                        rooms: res
                    })
                }
            })
    }

    componentDidUpdate() {
        this.messagesEnd.current && this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
    }

    addUserToSocketRoom = (info, rooms_id) => {
        localStorage.rooms_id = rooms_id
        localStorage.roomName = info.roomName
        this.props.history.push('/chatroom')
        //window.location.reload()
    }

    handleRoomName = e => {
        e && e.preventDefault()
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
        roomFetches.getRoomByName(roomName)
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
                                this.addUserToSocketRoom(info, rooms_id)
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
                                       this.addUserToSocketRoom(info, rooms_id)
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
                            this.addUserToSocketRoom(info, rooms_id)
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

    setRoomName = roomName => {
        console.log(roomName)
        roomName !== this.state.roomName
            && this.setState({
                roomName
            }, () => this.handleRoomName())
    }

    changePointerEvents = e => {
        const value = {
            event: true,
            connection_id: this.context.componentConnection
        }
        console.log('working!', value)
        socket.emit('changePointerEvents', value)
    }

    render() {
        
        return(
        <>
            <div className="rooms_container main_container">
            <form 
                className="rooms_form" 
                onSubmit={e => this.handleRoomName(e)}
                onClick={e => this.changePointerEvents(e)}
                >
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
                <section className="room_section">
                    <div className="room_list_container">
                        <ul className="room_list">
                            {this.state.rooms && this.state.rooms.map((room, i) => 
                                <li key={i}
                                    tabIndex={0} 
                                    className="room"
                                    onKeyDown={e => e.key === "Enter" && this.setRoomName(room.name)}
                                    onClick={e => {
                                        this.changePointerEvents(room.name)
                                        this.setRoomName(room.name)
                                    }}>
                                    <h3 className="room_name">
                                        {room.name}
                                    </h3>
                                </li>
                            )}
                        </ul>
                    </div>
                </section>
            </div>
            </>
    )
    }
}