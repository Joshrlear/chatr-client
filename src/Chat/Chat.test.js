import React from 'react';
//import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
//import Chat from './Chat';
import Textarea from 'react-textarea-autosize';

describe('Chat rendering', () => {
  it('renders Textarea properly', () => {
    const tree = renderer
      .create(<Textarea />, {
        createNodeMock: () => document.createElement('textarea')
      })
      .toJSON();
      })
});
