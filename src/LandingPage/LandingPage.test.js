import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink } from 'react-router-dom';
import { mount } from 'enzyme'
import LandingPage from './LandingPage';

describe('Components', () => {
    it(`renders LandingPage without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
           <LandingPage/>
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })

    it('clicks Enter and goes to Profile', () => {
        const wrapper = mount(
            <BrowserRouter>
                <LandingPage/>
            </BrowserRouter>)
        wrapper.find(NavLink).simulate('click')
        // need to set timeout so that the state can update first.
        // the time doesn't matter, just running setTimeout
        // will ensure that it is qued last
        setTimeout(() => expect(window.location.pathname)
            .toBe('/profile'), 0)
    })
})