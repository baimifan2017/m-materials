import React, { Component } from 'react';
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
        title: '杭州市',
        id: '0-2',
      },
    ];

    return (
      <div>
          <ComTree
            style={{ width: 300 }}
            dataSource={treeData}
            allowClear
            afterSelect={this.handleAfterSelect}
            rowKey='id'
            name='comList'
            reader={{
              name: 'title',
            }}
          />
      </div>
    );
  }
}


export default App;