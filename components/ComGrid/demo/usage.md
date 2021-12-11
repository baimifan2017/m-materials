---
title: 本地数据请求
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ComGrid from '@m-materials/com-grid';

class App extends Component {
  render() {
    const combProps = {
      columns:[
        {title:"姓名", dataIndex:"name",width:150},
        {title:"代码", dataIndex:"code",width:150},
      ],
      dataSource:[
        {name:"张三",code:"zs"},
        {name:"李四",code:"ls"},
      ],
      reader:{
          name:['name','code']
      }
    }
    return (
      <div style={{width:'200px'}}>
        <ComGrid {...combProps}/>
      </div>
    );
  }
}

ReactDOM.render((
  <App />
), mountNode);
```
