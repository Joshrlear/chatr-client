import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Chatroom from './Chatroom';

describe('Components', () => {
    it(`renders Chatroom without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
           <Chatroom/>
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})