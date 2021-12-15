import SimpleGrid from '@m-materials/simple-grid';
// 必须手动引入
import '@m-materials/simple-grid/build/index.css';
import { Select } from 'antd';
import cls from 'classnames';
import { isNumber, isString } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
export default function ComGrid(props) {
  const { value, dataSource = [],
    columns, pagination, placeholder, allowClear, disabled, showSearch,
    store, searchProperties, ...others } = props;

  const [showGrid, setShowGrid] = useState(false);
  const [mValue, setValue] = useState();


  let quickSearchValue = null; // 快速过滤value
  let gridRef = null;

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
  const onRowEventChange = (record, idx) => {
    return {
      onClick: () => afterSelect(record, idx),
    };
  };

  /**
   * 保存快速查询value
   */
  const onSearchChange = (e) => {
    quickSearchValue = e.target.value;
  };

  const onSearch = () => {
    let temParams = {};
    searchProperties.forEach(propert => {
      temParams[propert] = quickSearchValue
    })
    if (store.url) {
      gridRef.findByPage(temParams)
    } else {
      gridRef.localFetch(temParams)
    }
  };

  const initComboGrid = (ref) => {
    if (ref) {
      const { width } = props;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
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



  const getTableWidth = () => {
    const { width, columns } = props;
    if (width) {
      return width
    } else if (Array.isArray(columns)) {
      let temWidth = 0;
      columns.forEach(item => {
        if (item.width) {
          if (isString(item.width)) {
            temWidth = temWidth + Number(item.width.replace(/px/i, ''))
          } else if (isNumber(item.width)) {
            temWidth = temWidth + item.width
          }
          return temWidth;
        }
      })
    }
  }

  return (
    <div className={cls('com-grid')} {...others}>
      <Select
        // ref={(ele) => (this.select = ele)}
        placeholder={placeholder}
        // onDropdownVisibleChange={this.showComboGrid}
        // open={showGrid}
        style={{ width: '100%' }}
        className='com-grid-select'
        allowClear={allowClear}
        onChange={onClearValue}
        disabled={disabled}
        value={mValue}
        {...others}
        dropdownRender={() => (
          <div className={cls('com-grid-drop')} ref={(ref) => initComboGrid(ref)}>
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
              ref={(node) => (gridRef = node)}
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: getTableWidth(), y: 200 }}
              size="middle"
              onRow={(record, index) => onRowEventChange(record, index)}
              position={['bottomCenter']}
            />
          </div>
        )}
      />
    </div>
  );
}

ComGrid.propTypes = {
  with: PropTypes.number, // Table宽度


};

ComGrid.defaultProps = {
  reader: {
    name: 'name'
  }
};
