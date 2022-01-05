---
title: 本地数据（无分页）
order: 2
--- 

无分页ComList

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ComList from '@m-materials/com-list';

class NoPageBar extends Component {
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
      pagination:false
    };
    return (
      <div style={{ width: '200px' }}>
        <ComList {...combProps} />
      </div>
    );
  }  
}

ReactDOM.render(<NoPageBar />, mountNode);
```
