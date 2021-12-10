import { Table } from 'antd';
import axios from 'axios';
import produce from 'immer';
import { get, isPlainObject, omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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

        if (!draft.position) {
          draft.position = ['bottomRight']
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

  /**
   * 外部ref调用分页查询
   * @param {object} extParams 
   */
  const findByPage = (extParams) => {
    fetch(pagination, { ...filters, ...extParams }, sorter);
  };

  /**
   * 执行查询
   *
   * @param params 查询条件
   */
  const fetch = (params = {}) => {
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
          // 保存分页条件以外的过滤条件
          const temFilters = omit(params, ['pagination'])

          setPagination({ ...res.pagination });
          setFilters({ ...temFilters });
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
    const { store, dataSource } = nextProps;
    const params = {
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    }
    if (store.url) {
      fetch(params);  // 远程
    } else if (Array.isArray(dataSource)) {
      localFetch(params) // 本地
    }
  };

  /**
   * 本地数据获取
   * @param {object} params 
   */
  const localFetch = (params) => {
    const { dataSource } = nextProps;
    const { pageSize, page } = constructReq(params);
    // 过滤条件中排出分页信息、排序信息
    const temFilters = omit(params, ['pagination', 'sortField', 'sortOrder']);
    const filterKeys = Object.keys(temFilters);
    let temDataSource = [];

    // 多条件过滤
    temDataSource = dataSource.filters(item => {
      return filterKeys.some(filterKey => item[filterKey] == temFilters[filterKey])
    })
    // 分页
    temDataSource = temDataSource.splice(page * pageSize, pageSize)

    setData(temDataSource);
    setPagination(params.pagination)
  }

  /**
   * 始化入口
   * 如果store中url参数配置，执行远程数据加载，否则执行本地数据加载。
   */
  const init = () => {
    const { store, dataSource } = nextProps;
    if (store && store.url) {
      fetch({ pagination });
    } else if (Array.isArray(dataSource) && dataSource.length > 0) {
      setData(nextProps.dataSource)
    }
  }

  useEffect(() => {
    init();
    return () => {
      setData([])
    }
  }, [get(nextProps, 'store.url'), get(nextProps, 'store.params')]);

  const constructorTableProps = () => {
    return omit(nextProps, ['resMapping']);
  };

  pagination.position = nextProps.position;
  return (
    <div className="SimpleGrid">
      <Table
        columns={nextProps.columns}
        rowKey={(record) => record.id}
        dataSource={data || []}
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
  resMapping: {
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    content: 'content'
  },
};
