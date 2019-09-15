import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Rooms from './Rooms';
import renderer from 'react-test-renderer';
import Textarea from 'react-textarea-autosize';

describe('Components', () => {
    it(`renders Rooms without crashing`, () => {
        const div = document.createElement('div')
        ReactDOM.render(
        <BrowserRouter>
           <Rooms/>
        </BrowserRouter>, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})

describe('Textarea rendering', () => {
  it('renders Textarea properly', () => {
    const tree = renderer
      .create(<Textarea />, {
        createNodeMock: () => document.createElement('textarea')
      })
      .toJSON();
      })
});
