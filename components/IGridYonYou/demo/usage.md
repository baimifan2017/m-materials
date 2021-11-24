---
title: Simple Usage
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IGridYonYou from '@m-materials/i-grid-yon-you';

class App extends Component {
  render() {
    return (
      <div>
        <IGridYonYou />
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
```
