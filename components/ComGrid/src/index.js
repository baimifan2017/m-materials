import SimpleGrid from '@m-materials/simple-grid';
import { Select } from 'antd';
import { isBoolean, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

export default function ComGrid(props) {
  const { defaultValue, value, dataSource = [], pagination, ...others } = props;
  const defaultV = value || defaultValue || undefined;
  const [showGrid, setShowGrid] = useState(false);
  const [mValue, setValue] = useState();
  const [gridData, setGridData] = useState([]);

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

  const initComboGrid = (ref) => {
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

  const getTableWidth = () => {
    const { width,columns } = props;
    if(width){
      return width
    }else if(Array.isArray(columns)){
      let temWidth = 0;
      columns.forEach(item => {
        if(item.width){
          if(isString(item.width)){
            temWidth = temWidth + Number(item.width.replace(/px/i,''))
          }else if(isNumber(item.width)){
            temWidth = temWidth + item.width
          }
          return temWidth;
        }
      })
    }
  }

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
              scroll={{ x: getTableWidth(), y: 200 }}
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

ComGrid.propTypes = {
  with:PropTypes.number, // Table宽度

  
};

ComGrid.defaultProps = {};
