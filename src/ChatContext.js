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
    componentConnection: '',
});

export default ChatContext;