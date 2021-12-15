
import SimpleGrid from '@m-materials/simple-grid';
import React from 'react';


class LocalSimpleGrid extends React.Component {
  render() {

    const props = {
      columns: [
        { title: '名称', dataIndex: 'code' },
        { code: '代码', dataIndex: 'code' },
      ],
      dataSource: [
        { name: '张三', code: '代码1' },
        { name: '李四', code: '代码2' },
      ],
    }
    return <SimpleGrid {...props}/>;
  }
}

export default LocalSimpleGrid;