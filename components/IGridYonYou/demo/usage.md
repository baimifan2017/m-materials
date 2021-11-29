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
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        render(text, record, index) {
          return index + 1;
        },
      },
      {
        title: '单号',
        dataIndex: 'operationNo',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'operationType',
        width: 150,
        render: (text) => {
          if (text) {
            return text;
          } else {
            return '岗位变更';
          }
        },
      },
    ];
    const gridProps = {
      columns: columns,
      store: {
        url: '/',
        type: 'get',
        params: {
          dataType: 3, // 岗位变更
        },
      },
      ref: (el) => (this.grid = el),
    };

    return (
      <div>
        <IGridYonYou {...gridProps} />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
