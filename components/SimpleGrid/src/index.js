import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { get, isPlainObject, omit } from 'lodash';
import axios from 'axios';
import { Table, Button } from 'antd';
import './index.css';

export default function SimpleGrid(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  // 过滤条件
  const [filters, setFilters] = useState({});
  const nextProps = produce(props, (draft) => {
    if (draft.columns && Array.isArray(draft.columns)) {
      draft.columns.map((item) => {
        if (!item.key) {
          item.key = get(item, 'dataIndex');
        }
      });
    }
  });

  /**
   * 构造请求参数，主要用于更强分页请求参数名称。
   * @param {object} params
   * @returns
   */
  const constructReq = (params) => {
    const { store } = nextProps;
    if (isPlainObject(store.reqMapping)) {
      const { pageSize = 'pageSize', page = 'page' } = store.reqMapping;

      return {
        [pageSize]: params.pagination.pageSize,
        [page]: params.pagination.current,
        ...params,
      };
    }
  };

  /**
   * 构建axios返回参数
   */
  const constructRes = (res) => {
    const { data } = res;
    const { store } = nextProps;
    if (isPlainObject(store.resMapping)) {
      const { current, pageSize, total, content } = store.resMapping;
      return {
        pagination: {
          current: get(data, current, 1), // 当前页
          pageSize: get(data, pageSize, 15), // 每页多少条数据
          total: get(data, total, 200),
        },

        dataSource: data || get(data, content),
      };
    }
  };

  const findByPage = (extParams) => {
    const { filters, sorter, ...others } = filters;
    fetch(pagination, { ...filters, ...extParams }, sorter);
  };
  /**
   * 执行查询
   *
   * @param params 查询条件
   */
  fetch = (params = {}) => {
    const { store } = nextProps;
    if (isPlainObject(store)) {
      const { url, header, method } = store;
      let axiosParams = {
        url: url || 'https://randomuser.me/api',
        method: method || 'get',
        header: header || {},
      };

      if (method === 'POST') {
        axiosParams.data = constructReq(params);
      } else {
        axiosParams.params = constructReq(params);
      }

      setLoading(true);
      axios({ ...axiosParams })
        .then((data) => {
          console.log(data);
          const { res } = constructRes(data);

          setPagination({ ...res.pagination });
          setFilters({ ...filters });
          setData(res.dataSource);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  /**
   * 分页查询
   * @param {object} filters
   * @param {object} pagination
   * @param {object} sorter
   */
  const handleTableChange = (pagination, filters, sorter) => {
    debugger;
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  useEffect(() => {
    // 执行查询
    fetch({ pagination });
  }, [nextProps.url]);

  const constructorTableProps = () => {
    return omit(nextProps, ['resMapping']);
  };

  return (
    <div className="SimpleGrid">
      <Table
        columns={nextProps.columns}
        rowKey={(record) => record.id}
        dataSource={data || []}
        dataSource={[]}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        {...constructorTableProps()}
      />
    </div>
  );
}

SimpleGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  pagination: PropTypes.object || PropTypes.bool,
  store: PropTypes.shape({
    url: PropTypes.string,
    method: PropTypes.string,
    params: PropTypes.object,
    resMapping: PropTypes.shape({
      color: PropTypes.string,
      fontSize: PropTypes.number,
    }),
  }),
};

SimpleGrid.defaultProps = {
  columns: [
    {
      title: '名称',
      dataIndex: 'name',
    },
  ],
  resMapping: PropTypes.shape({
    total: 200,
    pageSize: 15,
    current: 1,
  }),
};
