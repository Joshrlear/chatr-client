import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from "history"
import { create } from "react-test-renderer"
import Chatroom from './Chatroom';

const customHistory = createBrowserHistory();

describe('Chatroom', () => {
    it(`renders Chatroom with context and history without errors`, () => {
        const props = {
            location: {
                pathname: "/testpath"
            },
            history: customHistory,
            scrollIntoView: window.HTMLElement.prototype.scrollIntoView = function() {}
        }
      const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
            <Chatroom {...props} />
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })

    it('leaves Rooms', () => {
        const props = {
            location: {
                pathname: "/testpath"
            },
            history: customHistory
        }
        const component = create(<Chatroom {...props} />)
        const instance = component.getInstance()
        instance.setState({ user_id: '1', rooms_id: '1' })
        instance.leaveRoom()
        expect (window.location.pathname).toBe("/rooms")
    })
})