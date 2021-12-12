---
title: 本地数据
order: 1
---

本地数据

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Popover, Button } from 'antd';
import InfoTree from '@m-materials/info-tree';

class BasicDemo extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 删除行
   * @param row
   */
  handleDel = (row) => {
    console.log(row);
  };

  /**
   * 保存
   * @param v
   * @param row
   */
  handleSave = (v, row) => {
    console.log(v, row);
  };

  /**
   * 选择tree节点事件
   * @param row
   */
  onSelect = (row) => {
    console.log(row);
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

    const popElement = <div>这里可以是任何React.Element 内容</div>;
    const treeProps = {
      myTitle: 'title',
      myKey: 'id',
      onSelect: this.onSelect,
      header: {
        right: (
          <Popover content={popElement} title="新增根目录" trigger="click">
            <Button onClick={this.handleAdd}>新增</Button>
          </Popover>
        ),
      },
      dataSource: treeData,
    };

    return <InfoTree {...treeProps} />;
  }
}

ReactDOM.render(<BasicDemo />, mountNode);
```
