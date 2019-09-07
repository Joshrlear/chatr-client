import config from './config'

const { SERVER_BASE_URL } = config

const userFetches = {
    createUser(username) {
       console.log('--- In userFetches, user doesn\'t exist, so lets create one!', username)
       const body = {
           username
        }
       return (
        fetch(`${SERVER_BASE_URL}users`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log('this is fetches createUser res:', res)
            if(!res.ok) {
                console.log('res is not okay here')
                throw new Error ('user not created')
            }
            else {
                console.log('res is okay here')
                return res.json()
            }
        })
        .catch(err => { return err })
       )
    },

    getUser(username) {
        console.log('--- In userFetches, does username already exist?', username)
        return (
            fetch(`${SERVER_BASE_URL}users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log('in fetches, this is the res:', res)
                if(!res.ok) {
                    console.log('no goos :(')
                    throw new Error('username not found')
                }
                else {
                    console.log('success!')
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
        console.log('body to be sent:',body)
        return (
            fetch(`${SERVER_BASE_URL}rooms`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log('in fetches, should show res:', res)
                if(!res.ok) {
                    console.log('res is not okay here')
                    throw new Error('room not created')
                }
                else {
                    console.log('res is okay here')
                    return res.json()
                }
            })
            .catch(err => { return err })
        )
    },

    getRoom(roomName) {
        console.log(roomName)
        return fetch(`${SERVER_BASE_URL}rooms/${roomName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    console.log('no goos :(')
                    //return res.json()
                    throw new Error('roomName not found')
                }
                else {
                    console.log('success!')
                    return res.json()
                }
            })
            .catch(err => { return err })
    }
}

const userRoomsFetches = {

    addUser(user_id, rooms_id) {
        const body = {
            user_id,
            rooms_id
        }
        console.log('this is the body posting to /userRooms', body)
        return (
            fetch(`${SERVER_BASE_URL}userRooms`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log('fetches, this is the res:', res)
                if(!res.ok) {
                    console.log('sending error')
                    throw new Error('couldn\'t add user to room') 
                }
                else {
                    console.log('All good sending the res:', res)
                    return res
                }
            })
            .catch(err => { return err })
        )
    },

    getUserRooms(user_id, rooms_id) {
        return (
        fetch(`${SERVER_BASE_URL}userRooms/${user_id}/${rooms_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log('user is already in room:', res)
            return res
            /* if(!res.ok) {
                console.log('this is the bad res:', res)
                throw new Error('user hasn\'t joined this room')
            }
            else {
                console.log('this is the good res:', res)
                return res.json()
            } */
        })
        //.catch(err => { return err })
        )
    },

    userLeavesRoom(user_id, rooms_id) {
        const body = {
            user_id,
            rooms_id
        }
        console.log('this is the body posting to /userRooms/userLeavesRoom', body)
        return (
            fetch(`${SERVER_BASE_URL}userRooms/userLeavesRoom`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log('this is the res:', res)
                if(!res.ok) {
                    console.log('this is the bad res:', res)
                    throw new Error('Could not leave room')
                }
                else {
                    console.log('this is the good res:', res)
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