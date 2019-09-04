const tree = renderer
  .create(<Textarea />, {
    createNodeMock: () => document.createElement('textarea')
  })
  .toJSON();