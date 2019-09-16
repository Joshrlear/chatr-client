import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Rooms from './Rooms'
import ChatContext from '../ChatContext'
import { createBrowserHistory } from "history"

const customHistory = createBrowserHistory();

describe('Rooms', () => {
    it(`renders Rooms with context and history without errors`, () => {
      const contextValue = {
        updateAppState: () => {}
      }
      const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
          <ChatContext.Provider value={ contextValue }>
            <Rooms history={customHistory} />
          </ChatContext.Provider>
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })    
})