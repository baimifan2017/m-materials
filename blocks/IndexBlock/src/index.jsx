import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { Button, Dropdown, Menu } from 'antd';
import React, { useRef } from 'react';
import request from 'umi-request';
import { columns } from './constant';
import { URL } from './service';
import styles from './index.module.less';


const menu = (
  <Menu>
    <Menu.Item key="1">拓展功能1</Menu.Item>
    <Menu.Item key="2">拓展功能2</Menu.Item>
    <Menu.Item key="3">拓展功能3</Menu.Item>
  </Menu>
);

export default function IndexView(props) {
  const actionRef = useRef();

  /**
     * 更新行信息
     * @param {object} record 行信息
     */
  const onUpdate = (record) => {
    // todo
  };

  const onView = (record) => {
    // todo
  };

  /**
   * 额外的操作项
   * @param {string} k
   * @param {object} record
   */
  const onExtraFunc = (k, record) => {
    if (key === 'delete') {
    // todo
    }
  };

  const gridColumn = [
    ...columns,
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => onUpdate(record)}>
          编辑
        </a>,
        <a onClick={() => onView(record)} rel="noopener noreferrer" key="view">
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={(k) => onExtraFunc(k, record)}
          menus={[
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ];


  return (
    <div className={styles.container}>
      <ProTable
        columns={gridColumn}
        actionRef={actionRef}
        request={async (params = {}, sort, filter) => {
          console.log(params, sort, filter);
          return request(URL.list, { params });
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
          <Dropdown key="menu" overlay={menu}>
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </div>
  );
}
