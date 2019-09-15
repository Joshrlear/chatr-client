import React from 'react';
import renderer from 'react-test-renderer';
import Textarea from 'react-textarea-autosize';

describe('Textarea rendering', () => {
  it('renders Textarea properly', () => {
    const tree = renderer
      .create(<Textarea />, {
        createNodeMock: () => document.createElement('textarea')
      })
      .toJSON();
      })
});
