---
title: Simple Usage
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ComTree from '@m-materials/com-tree';

class App extends Component {
  handleAfterSelect = (item) => {
    console.log(item);
  };
  render() {
    const treeData = [
      {
        title: '四川省',
        id: '0-0',
        children: [
          {
            title: '成都市',
            id: '0-0-0',
            children: [
              { title: '天府新区', id: '0-0-0-0' },
              { title: '武侯区', id: '0-0-0-1' },
              { title: '成华区', id: '0-0-0-2' },
            ],
          },
          {
            title: '绵阳市',
            id: '0-0-1',
            children: [
              { title: '高新区', id: '0-0-1-0' },
              { title: '经开区', id: '0-0-1-1' },
              { title: '江油市', id: '0-0-1-2' },
            ],
          },
          {
            title: '德阳市',
            id: '0-0-2',
          },
        ],
      },
      {
        title: '北京市',
        id: '0-1',
        children: [
          { title: '朝阳区', id: '0-1-0-0' },
          { title: '海淀区', id: '0-1-0-1' },
          { title: '西城区', id: '0-1-0-2' },
        ],
      },
      {
        title: '杭州市',
        id: '0-2',
      },
    ];

    return (
      <div>
        <ComTree
          style={{ width: '100%' }}
          dataSource={treeData}
          allowClear
          afterSelect={this.handleAfterSelect}
          rowKey='id'
          reader={{
            name: 'title',
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
