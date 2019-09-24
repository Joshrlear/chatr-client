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
        this.context.updateAppState()
    }

    componentDidMount() {
        // connect to componentConnection socket room
        const connection_id = this.context.componentConnection
        socket.emit('connect to components', connection_id)

        if (!localStorage.user_id) {
            this.props.history.push('/profile')
        }
        else {
            if (!localStorage.rooms_id) {
                roomFetches.getAllRooms()
                .then(res => {
                    if (res.length > 0) {
                        this.setState({
                            rooms: res
                        })
                    }
                })
            }
            else {
                this.props.history.push('/chatroom')
            }
        }
    }

    addUserToSocketRoom = (info, rooms_id) => {
        localStorage.rooms_id = rooms_id
        localStorage.roomName = info.roomName
        this.props.history.push('/chatroom')
    }

    handleRoomName = e => {
        e && e.preventDefault()
        const roomName = this.state.roomName.replace(/\s+/g, '-').toLowerCase()
        const username = localStorage.username 
        const info = {
            roomName,
            username
        }

        this.setState({
            roomName
        })

        // check whether roomName exists
        roomFetches.getRoomByName(roomName)
        .then(res => {
            if(!res.id) {
                // if room doesn't exists, create room
                roomFetches.createRoom(roomName)
                .then(res => {
                    if(!res.id) {
                        throw new Error('Could not create room')
                    }
                    else {
                        // now room exists, add user to room
                        const rooms_id = res.id
                        const user_id = parseInt(localStorage.user_id)
                        userRoomsFetches.addUser(user_id, rooms_id)
                        .then(res => {
                            if(!res.ok) {
                                throw new Error('user not added')
                            }
                            else {
                                // user has been added to room. update state with room_id
                                // and add to socket room
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
                // if room exists, add user to room
                const rooms_id = res.id
                const user_id = localStorage.user_id

                // check if user is already in room
                userRoomsFetches.getUserRooms(user_id, rooms_id)
                    .then(res =>{
                        if(res.status === 204) {
                            // user not in room yet. add user
                            userRoomsFetches.addUser(user_id, rooms_id)
                                .then(res => {
                                   if(!res.ok) {
                                       throw new Error('user not added')
                                   }
                                   else {
                                       // user added to room. update state to 
                                       // show which room they are in
                                       // then add user to socket room
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
        socket.emit('changePointerEvents', value)
    }

    render() {
        const scrollShadows = this.state.rooms && this.state.rooms.length > 12 ? " scroll_shadow" : ""
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
                    <input disabled={ this.state.roomName.length < 3 } className="save_btn btn-2" type='submit' value='Create Room' />
                  </div>
                </form>
                <section className={`room_section${scrollShadows}`}>
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