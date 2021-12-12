/**
 * @description: 树状表演示
 */

import React, { useRef } from 'react';
import { Button, Popconfirm, Popover } from 'antd';
import InfoTree from '@m-materials/info-tree';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

const Demo = (props) => {
  const myRef = useRef();

  /**
   * 删除行
   * @param row
   */
  const handleDel = (row) => {
    console.log(row);
  };

  /**
   * 保存
   * @param v
   * @param row
   */
  const handleSave = (v, row) => {
    console.log(v, row);
  };

  /**
   * 选择tree节点事件
   * @param row
   */
  const onSelect = (row) => {
    console.log(row);
  };

  const popElement = <div>这里可以是任何React.Element 内容</div>;
  /**
   * 树形结构item后额外Element
   * @returns React.Element
   */
  const renderItemExtra = ({ title, children, key }) => {
    const commStyle = {
      fontSize: 12,
      cursor: 'pointer',
      margin: '0 3px',
    };

    const popElement = <div>可以在这里配置新增内容</div>;
    return [
      <Popover title="新增子节点" key="add" content={popElement} trigger="click">
        <PlusCircleOutlined style={{ ...commStyle, color: 'red' }} />
      </Popover>,
      <Popconfirm
        title="确定删除？删除后不可恢复"
        key="del"
        onConfirm={() => handleDel(row)}
        okText="确认"
        cancelText="取消"
      >
        <MinusCircleOutlined style={{ ...commStyle }} />
      </Popconfirm>,
    ];
  };

  const { handleAdd } = props;
  const treeProps = {
    myTitle: 'name',
    myKey: 'id',
    renderItemExtra,
    onSelect,
    header: {
      right: (
        <Popover content={popElement} title="新增根目录" trigger="click">
          <Button onClick={handleAdd}>新增</Button>
        </Popover>
      ),
    },
    ref: myRef,
    store: {
      url: '/test',
    },
  };
  return (
    <>
      <InfoTree {...treeProps} />
    </>
  );
};

export default Demo;
