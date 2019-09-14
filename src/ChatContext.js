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
    updateAppState: () => {},
    componentConnection: '',
});

export default ChatContext;