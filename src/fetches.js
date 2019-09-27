import config from './config'

const { SERVER_BASE_URL } = config

const userFetches = {
    createUser(username) {
       const body = {
           username
        }
       return (
        fetch(`${SERVER_BASE_URL}api/users`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                throw new Error ('user not created')
            }
            else {
                return res.json()
            }
        })
        .catch(err => { return err })
       )
    },

    getUser(username) {
        return (
            fetch(`${SERVER_BASE_URL}api/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('username not found')
                }
                else {
                    return res.json()
                }
            })
            .catch(err => { return err })
        )
    }
}

const roomFetches = {
    createRoom(roomName) {
        const body = {
            roomName
        }
        return (
            fetch(`${SERVER_BASE_URL}api/rooms`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('room not created')
                }
                else {
                    return res.json()
                }
            })
            .catch(err => { return err })
        )
    },

    getRoomByName(roomName) {
        const roomQuery = `${roomName}=name`
        return fetch(`${SERVER_BASE_URL}api/rooms/${roomQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('roomName not found')
                }
                else {
                    return res.json()
                }
            })
            .catch(err => { return err })
    },

    getRoomById(rooms_id) {
        const roomQuery = `${rooms_id}=id`
        return fetch(`${SERVER_BASE_URL}api/rooms/${roomQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('rooms_id not found')
                }
                else {
                    return res.json()
                }
            })
            .catch(err => { return err })
    },

    getAllRooms() {
        return fetch(`${config.SERVER_BASE_URL}api/rooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json()
        })
    }
}

const userRoomsFetches = {

    addUser(user_id, rooms_id) {
        const body = {
            user_id,
            rooms_id
        }
        return (
            fetch(`${SERVER_BASE_URL}api/userRooms`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('couldn\'t add user to room') 
                }
                else {
                    return res
                }
            })
            .catch(err => { return err })
        )
    },

    getUserRooms(user_id, rooms_id) {
        return (
            fetch(`${SERVER_BASE_URL}api/userRooms/${user_id}/${rooms_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                return res
            })
        )
    },

    userLeavesRoom(user_id, rooms_id) {
        console.log(SERVER_BASE_URL)
        const body = {
            user_id,
            rooms_id
        }
        return (
            fetch(`${SERVER_BASE_URL}api/userRooms/userLeavesRoom`, {
                method: 'DELETE',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw new Error('Could not leave room')
                }
                else {
                    return res
                }
            })
            .catch(err => { return err })
        )
    },
}

export default {
    userFetches,
    roomFetches,
    userRoomsFetches
}