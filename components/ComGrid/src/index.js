import SimpleGrid from '@m-materials/simple-grid';
import { Select } from 'antd';
import { isBoolean, isPlainObject } from 'lodash';
import React, { useState } from 'react';

export default function ComGrid(props) {
  const { defaultValue, value, dataSource = [], pagination, ...others } = props;
  const defaultV = value || defaultValue || undefined;
  const [showGrid, setShowGrid] = useState(false);
  const [mValue, setValue] = useState();
  const [gridData, setGridData] = useState([]);

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
    defaultData = this.data.slice(0, defaultPagination.current * defaultPagination.pageSize);
  }

  const [myPagination, setPagination] = useState(defaultPagination);
  /**
   * 获取下拉Table表宽度
   * @returns w
   */
  const getTableWidth = () => {
    const { columns, width = 0 } = this.props;
    let w = 0;
    columns.forEach((col) => {
      if (col.width && col.width > 0) {
        w += col.width || 0;
      }
    });
    if ((w === 0 || w < width) && this.select && this.dataTable) {
      w += width || this.select.clientWidth || 0;
    }
    return w;
  };

  /**
   * 获取下拉选中值
   */
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

  const afterSelect = (item, index) => {
    const { afterSelect, reader, form, name, field = [] } = props;

    setShowGrid(false);
    setValue(getReader(reader.name, item));

    const data = { [name]: getReader(reader.name, item) };
    const formData = form ? form.getFieldsValue() : {};
    if (reader && reader.field && field.length > 0 && field.length === reader.field.length) {
      field.forEach((f, idx) => {
        data[f] = getReader(reader.field ? reader.field[idx] : '', item);
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

  /**
   * 下拉Table点击事件
   */
  onRowEventChange = (record, idx) => {
    return {
      onClick: () => afterSelect(record, idx),
    };
  };

  /**
   * 查询
   */
  onSearchChange = (e) => {
    this.quickSearchValue = e.target.value;
  };

  initComboGrid = (ref) => {
    if (ref) {
      const { width } = props;
      this.comboGrid = ref;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
  };

  const getData = () => {
    const { cascadeParams, store, remotePaging, searchProperties } = props;
    const { pagination } = this.state;
    const { params } = store || {};
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
      this.loaded = false;
      Object.assign(superParams, cascadeParams);
    }
    if (!this.loaded) {
      this.loadData(superParams);
    }
  };

  const showComboGrid = (showGrid) => {
    if (showGrid) {
      const { store } = props;
      if (store) {
        getData();
      }
      this.setState({ showGrid }, () => {
        window.setTimeout(this.onResize, 200);
      });
    }
  };

  const onSearchChange = (e) => {
    this.quickSearchValue = e.target.value;
  };

  const onClearValue = () => {
    const { afterClear, form, name, reader, field = [] } = props;
    setValue(undefined);
    const data = { [name]: null };
    if (reader && reader.field && field.length === reader.field.length) {
      field.forEach((f) => {
        data[f] = null;
      });
    }
    if (form) {
      form.setFieldsValue(data);
    }
    if (afterClear) {
      afterClear();
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
      setPagination(paginationTmp);
      this.focus();
      this.getData();
    } else {
      const newData = this.getLocalFilterData();
      let gridData = [...newData];
      if (!isBoolean(paginationTmp) && isPlainObject(paginationTmp)) {
        if ('pageSize' in paginationTmp) {
          gridData = newData.slice(0, paginationTmp.pageSize);
        }
        Object.assign(paginationTmp, { current: 1, total: newData.length });
      }
      setGridData(getData);
    }
  };

  return (
    <div className="ComGrid" {...others}>
      <Select
        ref={(ele) => (this.select = ele)}
        placeholder={placeholder}
        onDropdownVisibleChange={this.showComboGrid}
        // open={showGrid}
        allowClear={allowClear}
        onChange={onClearValue}
        disabled={disabled}
        {...selectRestProps}
        dropdownRender={() => (
          <div className={cls('seid-combo-grid')} ref={(ref) => initComboGrid(ref)}>
            {showSearch ? (
              <div className="action-bar">
                <Search
                  ref={(node) => (this.searchInput = node)}
                  placeholder={searchPlaceHolder}
                  onChange={onSearchChange}
                  onSearch={onSearch}
                  onPressEnter={onSearch}
                />
              </div>
            ) : null}
            <SimpleGrid
              style={{ wordBreak: 'break-word' }}
              loading={loading}
              ref={(node) => (this.dataTable = node)}
              columns={columns}
              dataSource={gridData}
              scroll={{ x: getTableWidth(), y: height }}
              size="middle"
              onRow={(record, index) => onRowEventChange(record, index)}
              position='center'
            />
          </div>
        )}
      />
    </div>
  );
}

ComGrid.propTypes = {};

ComGrid.defaultProps = {};
