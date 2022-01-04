---
title: 本地数据（带分页）
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ComList from '@m-materials/com-list';

class App extends Component {
  render() {
    const combProps = {
      dataSource: [
        { title: '张三', code: 'zs' },
        { title: '李四', code: 'ls' },
      ],
      reader: { 
        name: 'title',
        description: 'code',
      }, 
      defaultValue: '张三',
    };
    return (
      <div style={{ width: '200px' }}>
        <ComList {...combProps} />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```

