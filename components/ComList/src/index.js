import React, { useEffect, useState } from 'react';
import { List, Pagination, Select, Skeleton } from 'antd';
import axios from 'axios';
import { isBoolean, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import './index.less';


export default function ComList(props) {
  const {
    width,
    listProps,
    reader,
    allowClear,
    disabled,
    showSearch,
    searchPlaceHolder,
    placeholder,
    style = {},
    className,
    ...others
  } = props;
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [value, setValue] = useState();
  const [listData, setListData] = useState([]);
  const [pagination, setPagination] = useState({});

  let comboListRef = null;
  let data = [];
  let loaded = false;


  useEffect(() => {
    const { defaultValue, value, dataSource = [], pagination } = props;
    const defaultV = value || defaultValue || undefined;
    loaded = false;
    data = [...dataSource];

    const defaultPagination =
      pagination === false
        ? false
        : {
          current: 1,
          pageSize: 15,
          total: dataSource.length || 0,
          ...(isBoolean(pagination) ? {} : pagination),
        };
    let defaultData = dataSource;
    if (!isBoolean(defaultPagination) && isPlainObject(defaultPagination)) {
      defaultData = data.slice(
        0,
        defaultPagination.current * defaultPagination.pageSize,
      );
    }

    setValue(defaultV);
    setLoading(false);
    setListData(defaultData);
    setPagination(defaultPagination);
    setShowList(false)
  }, [])


  useEffect(() => {
    const { defaultValue, value } = props;
    const defaultV = value || defaultValue || undefined;
    Object.assign(pagination, { current: 1 });
    setValue(defaultV);
    setPagination(pagination)

    return () => {
      document.removeEventListener('mousedown', hideComboList);

    }
  }, [props.cascadeParams, props.value])


  const hideComboList = (e) => {
    const tDom = ReactDOM.findDOMNode(comboListRef);
    if (showList) {
      if (tDom && tDom.contains(e.target)) {
        focus();
      } else {
        setTimeout(() => {
          setShowList(false);
        })
      }
    }
  };

  const showComboList = (showList) => {
    if (showList) {
      const { store } = this.props;
      if (store) {
        getData();
      }
      setShowList(showList)
    }
  };

  const getReaderData = (obj) => {
    const { reader } = this.props;
    let data = [];
    if (reader.data) {
      data = this.getReader(reader.data, obj) || [];
    }
    return data;
  };

  const getReader = (readerField, obj) => {
    let data = null;
    if (typeof obj === 'object' && readerField) {
      const s = readerField.split('.');
      let d = obj[s[0]];
      for (let i = 1; i < s.length; i++) {
        d = d[s[i]];
        if (d instanceof Array && d.length > 0 && i < s.length - 1) {
          d = d[0];
        }
      }
      if (d) {
        data = d;
      }
    }
    return data;
  };

  const getData = () => {
    const { cascadeParams, store, remotePaging, searchProperties } = props;
    const superParams = { ...(params || {}) };
    if (remotePaging && !isBoolean(pagination) && isPlainObject(pagination)) {
      Object.assign(superParams, {
        quickSearchValue: this.quickSearchValue,
        quickSearchProperties: searchProperties,
        pageInfo: {
          page: pagination.current,
          rows: pagination.pageSize,
        },
      });
    }
    if (cascadeParams) {
      Object.assign(superParams, cascadeParams);
    }
    loadData(superParams);
  };

  const loadData = (params) => {
    const { store, afterLoaded, remotePaging, reader } = props;
    const { url, type } = store || {};
    setLoading(true);
    const requestOptions = {
      method: type,
      url,
      headers: { neverCancel: true },
    };
    if (type.toLocaleLowerCase() === 'get') {
      requestOptions.params = params;
    } else {
      requestOptions.data = params;
    }
    if (url) {
      axios(requestOptions)
        .then((res) => {
          if (res.success) {
            const resultData = res.data || [];
            let ds = [];
            if (reader && reader.data) {
              ds = getReaderData(resultData);
            } else if (resultData instanceof Array) {
              ds = resultData;
            } else if (resultData.rows instanceof Array) {
              ds = resultData.rows;
            }
            if (
              remotePaging &&
              !isBoolean(pagination) &&
              isPlainObject(pagination)
            ) {

              setListData(ds);
              setPagination({
                ...pagination,
                current: 1,
                total: resultData.records,
              })
            } else {
              this.data = ds;
              let listData = [...ds];
              let paginationTmp = pagination;
              if (!isBoolean(pagination) && isPlainObject(pagination)) {
                paginationTmp = {
                  ...pagination,
                  current: 1,
                  total: ds.length,
                };
                const { pageSize = 15 } = pagination;
                listData = this.data.slice(0, pageSize);
              }

              setListData(listData);
              setPagination(paginationTmp)
            }
            if (afterLoaded && afterLoaded instanceof Function) {
              afterLoaded(ds);
            }
          }
        })
        .finally(() => {
          this.loaded = true;
          setLoading(false)
        });
    }
  };

  /**
   * 分页查询
   */
  const onPageChange = (current, pageSize) => {
    const { remotePaging } = props;
    let paginationTmp = pagination;
    if (!isBoolean(pagination) && isPlainObject(pagination)) {
      paginationTmp = {
        ...pagination,
        current,
        pageSize,
      };
    }

    setPagination(paginationTmp);
    if (remotePaging) {
      this.loaded = false;
      getData();
    } else {
      const newData = this.getLocalFilterData();
      const listData = newData.slice(
        (current - 1) * pageSize,
        current * pageSize,
      );
      setListData(listData)
    }
  };


  const afterSelect = (item, index) => {
    const { afterSelect, reader, form, name, field = [] } = props;
    setShowList(false);
    setValue(getReader(reader.name, item))
    const data = { [name]: getReader(reader.name, item) };
    const formData = form ? form.getFieldsValue() : {};
    if (
      reader &&
      reader.field &&
      field.length > 0 &&
      field.length === reader.field.length
    ) {
      field.forEach((f, idx) => {
        data[f] = getReader(
          reader.field ? reader.field[idx] : '',
          item,
        );
      });
    }
    Object.assign(formData, data);
    if (form) {
      form.setFieldsValue(formData);
    }
    if (afterSelect) {
      afterSelect(item, index);
    }
  };

  const getLocalFilterData = () => {
    const { reader, name } = props;
    let newData = this.data;
    const searchValue = this.quickSearchValue;
    if (searchValue) {
      let filterName = name;
      if (reader && reader.name) {
        filterName = reader.name;
      }
      newData = newData.filter(item => {
        const fieldValue = getReader(filterName, item);
        if (fieldValue) {
          return (
            fieldValue.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          );
        }
        return false;
      });
    }
    return newData;
  };


  const onClearValue = () => {
    const { afterClear, form, name, reader, field = [] } = props;

    setValue(undefined);
    const data = { [name]: null };
    if (reader && reader.field && field.length === reader.field.length) {
      field.forEach(f => {
        data[f] = null;
      });
    }
    if (form) {
      form.setFieldsValue(data);
    }
    if (afterClear && afterClear instanceof Function) {
      afterClear();
    }
  };

  const onSearchChange = (e) => {
    this.quickSearchValue = e.target.value;
  };

  const focus = () => {
    if (this.searchInput && this.searchInput.input) {
      setCursorPosition(
        this.searchInput.input.input,
        this.quickSearchValue.length,
      );
    }
  };

  const onSearch = () => {
    const { remotePaging } = props;
    let paginationTmp = pagination;
    if (!isBoolean(pagination)) {
      paginationTmp = {
        ...pagination,
        current: 1,
      };
    }
    if (remotePaging) {
      this.loaded = false;

      setPagination(paginationTmp)
      focus();
      getData();
    } else {
      const newData = getLocalFilterData();
      let listData = [...newData];
      if (!isBoolean(paginationTmp) && isPlainObject(paginationTmp)) {
        listData = newData.slice(0, paginationTmp.pageSize);
        Object.assign(paginationTmp, { current: 1, total: newData.length });
      }


      setListData(listData);
      setPagination(paginationTmp)
      this.focus()
    }
  };

  const initComboList = (ref) => {
    if (ref) {
      comboListRef = ref;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
  };

  const getRowKey = (item, index) => {
    const { rowKey } = props;
    let key;
    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (typeof rowKey === 'string') {
      key = item[rowKey];
    } else {
      key = item.key;
    }
    if (!key) {
      key = `list-item-${index}`;
    }
    return key;
  };

  return (
    <div className={cls('com-list')} {...others}>
      <Select
        // ref={ele => (this.select = ele)}
        // onDropdownVisibleChange={showComboList}
        allowClear={allowClear}
        style={{ width: '100%' }}
        placeholder={placeholder}
        onChange={onClearValue}
        value={value}
        disabled={disabled}
        {...others}
        dropdownRender={() => (
          <div ref={ref => initComboList(ref)}>
            {showSearch ? (
              <div className="action-bar">
                <Search
                  ref={node => (this.searchInput = node)}
                  placeholder={searchPlaceHolder}
                  onChange={onSearchChange}
                  onSearch={onSearch}
                  onPressEnter={onSearch}
                />
              </div>
            ) : null}
            <div className='list-body'>
              <Scrollbars style={{ height: '220px' }}>
                <List
                  itemLayout={
                    listProps && listProps.itemLayout
                      ? listProps.itemLayout
                      : 'horizontal'
                  }
                  dataSource={listData}
                  loading={loading}
                  renderItem={(item, index) => (
                    <List.Item
                      key={getRowKey(item, index)}
                      onClick={() => afterSelect(item, index)}
                      className={cls({
                        [cls('row-selected')]:
                          getReader(reader.name, item) === value,
                      })}
                    >
                      <Skeleton loading={loading} active>
                        {listProps && listProps.renderItem ? (
                          listProps.renderItem(item, index)
                        ) : (
                          <List.Item.Meta
                            title={getReader(reader.name, item)}
                            description={
                              reader.description
                                ? getReader(reader.description, item)
                                : ''
                            }
                          />
                        )}
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </Scrollbars>
            </div>
            {props.pagination === false ? null : (
              <div className="list-page-bar">
                <Pagination
                  simple
                  onChange={onPageChange}
                  {...pagination}
                />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

ComList.defaultProps = {
  disabled: false
};

ComList.propTypes = {
  cascadeParams: PropTypes.object,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  allowClear: PropTypes.bool,
  classNames: PropTypes.string,
  placeholder: PropTypes.string,
  store: PropTypes.shape({
    type: PropTypes.oneOf(['GET', 'get', 'POST', 'post']),
    url: PropTypes.string,
    params: PropTypes.object,
    autoLoad: PropTypes.bool,
  }),
  reader: PropTypes.shape({
    data: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.array,
    description: PropTypes.string,
  }).isRequired,
  remotePaging: PropTypes.bool,
  showSearch: PropTypes.bool,
  width: PropTypes.number,
  searchPlaceHolder: PropTypes.string,
  searchProperties: PropTypes.array,
  dataSource: PropTypes.array,
  afterLoaded: PropTypes.func,
  afterSelect: PropTypes.func,
  afterClear: PropTypes.func,
  listProps: PropTypes.shape({
    itemLayout: PropTypes.oneOf(['vertical', 'horizontal']),
    renderItem: PropTypes.func,
  }),
  rowKey: PropTypes.string,
  name: PropTypes.string.isRequired,
  field: PropTypes.array,
};
