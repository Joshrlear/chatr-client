import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme'
import 'jest-localstorage-mock'
import App from './App';

describe('Components', () => {
    it(`renders App without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
           <App/>
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
    beforeAll(() => {
        localStorage.clear();
      })

    it('localStorage should be blank then resets state, and update profilePath', () => {

        const component = shallow(<App />)
        const instance = component.instance()
        instance.setState({ 
            user_id: 1, 
            username: "testuser", 
            rooms_id: 1, 
            roomName: "testroom"
        })
        instance.updateAppState()
        setTimeout(() => {
        expect(instance.state.user_id).toBe("")
        expect(instance.state.username).toBe("")
        expect(instance.state.rooms_id).toBe("")
        expect(instance.state.roomName).toBe("")
        expect(window.location.profilePath).toBe("/profile")}, 0)
    })
})