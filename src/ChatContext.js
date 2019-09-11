import { createContext } from 'react';

const ChatContext = createContext({
    user: {
        user_id: '',
        username: '',
        rooms_id: '',
        roomName: '',
    },
    updateRoomName: () => {},
    updateState: () => {},
    checkLocalStorage: () => {},
});

export default ChatContext;