---
title: Simple Usage
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SimpleGrid from '@m-materials/simple-grid';

class App extends Component {
  render() {
    const gridProps = {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
        },
      ],
      store: {
        url: 'https://randomuser.me/api',
        method: 'post',
      },
    };
    return (
      <div>
        <SimpleGrid {...gridProps} />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
