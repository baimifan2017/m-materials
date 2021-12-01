import SimpleGrid from '@m-materials/simple-grid';
import React from 'react';

class RemoteSource extends React.Component {
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
    return  <SimpleGrid {...gridProps} />
  }
}

export default RemoteSource;
