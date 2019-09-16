import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { create } from "react-test-renderer"
import { createBrowserHistory } from "history"
import Profile from './Profile'

const customHistory = createBrowserHistory();

describe('Profile', () => {
    it(`renders Profile with context and history without errors`, () => {
      const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
            <Profile location={{pathname: "/testpath"}} />
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })

    test('submit and go to Rooms', () => {
        const props = {
            location: {
                pathname: "/testpath"
            },
            history: customHistory
        }
        const component = create(<Profile {...props} />)
        const instance = component.getInstance()
        instance.setState({ username: 'testuser', name: 'differentuser' })
        instance.handleSubmit()
        // need to set timeout so that the state can update first.
        // the time doesn't matter, just running setTimeout
        // will ensure that it is qued last 
        setTimeout(() => expect(instance.state.username)
            .toBe("differentuser"), 0)
        expect(window.location.pathname).toBe("/rooms")
    })
})