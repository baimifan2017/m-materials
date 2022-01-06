import React from 'react';
import { isEqual, get } from 'lodash';
import { Select, Input, Skeleton, Tree } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';
import cls from 'classnames';
import './index.css';

const { Search } = Input;
const { TreeNode } = Tree;

const childFieldKey = 'children';

export default class ComTree extends React.Component {
  constructor(props) {
    super(props);
    const { defaultValue, value, dataSource = [] } = props;
    const defaultV = value || defaultValue || undefined;

    // 是否已经加载完成
    this.loaded = false;
    this.data = [...dataSource];
    // Dom节点
    this.comboList; // HTMLDivElement | undefined;
    // 当前选中节点
    this.select; // React.ReactNode;
    // 快速查询的value
    this.quickSearchValue = ''; // string = '';
    // searchInput ref
    this.searchInput; // any;

    this.state = {
      value: defaultV,
      loading: false,
      showTree: false,
      treeData: dataSource,
      autoExpandParent: true,
      defaultSelectedKeys: [],
      expandedKeys: [],
    };
  }

  // 鼠标移入自动加载数据
  componentDidMount() {
    document.addEventListener('mousedown', this.hideComboList, false);
    const { store } = this.props;
    if (store && store.autoLoad === true) {
      this.getData();
    }

    console.log(this.props)

  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideComboList);
  }

  hideComboList = (e) => {
    const { showTree } = this.state;
    const tDom = ReactDOM.findDOMNode(this.comboList);
    if (showTree) {
      if (tDom && tDom.contains(e.target)) {
        this.focus();
      } else {
        setTimeout(() => {
          this.setState({ showTree: false });
        }, 200);
      }
    }
  };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.cascadeParams, this.props.cascadeParams) || !isEqual(prevProps.value, this.props.value)) {
      const { defaultValue, value } = this.props;
      const defaultV = value || defaultValue || undefined;
      this.setState({
        value: defaultV,
      });
    }
  }

  showComboList = (showTree) => {
    if (showTree) {
      const { store } = this.props;
      if (store) {
        this.getData();
      }
      this.setState({ showTree });
    }
  };

  getReaderData = (obj) => {
    const { reader } = this.props;
    let data = [];
    if (reader.data) {
      data = this.getReader(reader.data, obj) || [];
    }
    return data;
  };

  getReader = (readerField, obj) => {
    let data = null;
    if (obj && typeof obj === 'object' && readerField) {
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

  getData = () => {
    const { cascadeParams, store } = this.props;
    const { params } = store || {};
    let superParams = { ...(params || {}) };
    if (cascadeParams) {
      this.loaded = false;
      superParams = { ...superParams, cascadeParams }
    }
    if (!this.loaded) {
      this.loadData(superParams);
    }
  };

  loadData = (params) => {
    const { store, afterLoaded, reader } = this.props;
    const { url, type,dataPath = 'data' } = store || {};
    const methodType = type || 'GET';
    this.setState({ loading: true });
    const requestOptions = {
      method: methodType,
      url,
      headers: { neverCancel: true },
    };
    if (methodType.toLocaleLowerCase() === 'get') {
      requestOptions.params = params;
    } else {
      requestOptions.data = params;
    }
    if (url) {
      axios(requestOptions)
        .then((res) => {
          if (res.success) {
            const resultData = res[dataPath] || [];
            let ds = [];
            if (reader && reader.data) {
              ds = this.getReaderData(resultData);
            } else if (resultData instanceof Array) {
              ds = resultData;
            }
            this.data = ds;
            this.setState({
              treeData: [...ds],
            });
            if (afterLoaded && afterLoaded instanceof Function) {
              afterLoaded(ds);
            }
          }
        })
        .finally(() => {
          this.loaded = true;
          this.setState({ loading: false });
        });
    }
  };

  onClearValue = () => {
    const { afterClear, form, name, reader, field = [] } = this.props;
    this.setState(
      {
        value: undefined,
      },
      () => {
        const data = { [name]: null };
        if (reader && reader.field && field.length === reader.field.length) {
          field.forEach((f) => {
            data[f] = null;
          });
        }
        if (form) {
          form.setFieldsValue(data);
        }
        if (afterClear && afterClear instanceof Function) {
          afterClear();
        }
      },
    );
  };

  filterNodes = (filterName, valueKey, treeData, expandedKeys) => {
    const { reader } = this.props;
    const { childKey } = reader;
    const newArr = [];
    treeData.forEach((treeNode) => {
      const nodeChildren = treeNode[childKey] || treeNode[childFieldKey];
      const fieldValue = this.getReader(filterName, treeNode);
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
        newArr.push(treeNode);
        expandedKeys.push(this.getRowKey(treeNode));
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(filterName, valueKey, nodeChildren, expandedKeys);
        const obj = {
          ...treeNode,
          [childKey || childFieldKey]: ab,
        };
        if (ab && ab.length > 0) {
          newArr.push(obj);
        }
      }
    });
    return newArr;
  };

  /**
   * 本地数据过滤
   * @returns {treeData}
   */
  getLocalFilterData = () => {
    const { expandedKeys: expKeys } = this.state;
    const { reader, name } = this.props;
    let newData = [...this.data];
    const expandedKeys = [...expKeys];
    const searchValue = this.quickSearchValue;
    if (searchValue) {
      let filterName = name;
      if (reader && reader.name) {
        filterName = reader.name;
      }
      newData = this.filterNodes(filterName, searchValue.toLowerCase(), newData, expandedKeys);
    }
    return { treeData: newData, expandedKeys };
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  handlerSearchChange = (e) => {
    this.quickSearchValue = e.target.value;
  };

  setCursorPosition = (ctrl, pos) => {
    if (ctrl?.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl?.createTextRange) {
      const range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

  focus = () => {
    if (this.searchInput && this.searchInput.input) {
      this.setCursorPosition(this.searchInput.input.input, this.quickSearchValue.length);
    }
  };

  onSearch = () => {
    const { treeData, expandedKeys } = this.getLocalFilterData();
    this.setState(
      {
        treeData,
        expandedKeys,
        autoExpandParent: true,
      },
      this.focus,
    );
  };

  initComboList = (ref) => {
    if (ref) {
      const { width } = this.props;
      this.comboList = ref;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
  };

  getRowKey = (item) => {
    const { rowKey = 'id' } = this.props;
    let key;
    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (typeof rowKey === 'string') {
      key = item[rowKey];
    } else {
      key = item.key;
    }

    if (!key) {
      throw new Error('rowKey is empty');
    }
    return key;
  };

  /**
   *
   * @param {string[]} selectedKeys
   * @returns
   */
  getItemBySelectedKeys = (selectedKeys) => {
    const nodeData = [];
    for (let i = 0; i < selectedKeys.length; i++) {
      this.getTreeNodeByKey(this.data, nodeData, selectedKeys[i]);
    }
    return nodeData;
  };

  /**
   * 获取树状节点信息
   * @param {object[]} treeNodes
   * @param {object[]} nodeData
   * @param {string} key
   */
  getTreeNodeByKey = (treeNodes, nodeData, key) => {
    const { reader } = this.props;
    const { childKey } = reader;
    for (let i = 0; i < treeNodes.length; i += 1) {
      const node = treeNodes[i];
      const rowKey = this.getRowKey(node);
      const nodeChildren = node[childKey] || node[childFieldKey];
      if (rowKey === key) {
        nodeData.push(node);
      }
      if (nodeChildren && nodeChildren.length > 0) {
        this.getTreeNodeByKey(nodeChildren, nodeData, key);
      }
    }
  };

  /**
   * 选中事件
   * @param {string} selectedKeys 已经选中的key
   * @param {AntTreeNodeSelectedEvent} e 鼠标事件
   */
  onSelect = (selectedKeys, e) => {
    const { afterSelect, reader, form, name, field = [] } = this.props;
    if (e.selected) {
      const selectNodes = this.getItemBySelectedKeys(selectedKeys);
      const item = selectNodes.length > 0 ? selectNodes[0] : null;
      this.setState(
        {
          showTree: false,
          value: this.getReader(reader.name, item),
        },
        () => {
          const data = name ? { [name]: this.getReader(reader.name, item) } : { [reader.name]: this.getReader(reader.name, item) };
          const formData = form ? form.getFieldsValue() : {};
          if (reader && reader.field && field.length > 0 && field.length === reader.field.length) {
            field.forEach((f, idx) => {
              data[f] = this.getReader(reader.field ? reader.field[idx] : '', item);
            });
          }
          Object.assign(formData, data);
          if (form) {
            debugger
            form.setFieldsValue(formData);
          }
          if (afterSelect) {
            afterSelect(item);
          }
        },
      );
    }
  };

  /**
   *
   * @param {object[]} data
   * @returns
   */
  renderTreeNodes = (data) => {
    const { reader } = this.props;
    const searchValue = this.quickSearchValue;
    return data.map((item) => {
      const { name, childKey } = reader;
      const readerValue = item[name] || '';
      const readerChildren = item[childKey] || item[childFieldKey];

      const i = readerValue.indexOf(searchValue.toLowerCase());
      const beforeStr = readerValue.substr(0, i);
      const afterStr = readerValue.substr(i + searchValue.length);
      const title =
        i > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{readerValue}</span>
        );

      if (readerChildren && readerChildren.length > 0) {
        return {
          title,
          key: this.getRowKey(item),
          children: this.renderTreeNodes(readerChildren),
        };
      }

      return {
        title,
        key: this.getRowKey(item),
      };
    });
  };

  render() {
    const { allowClear, placeholder, disabled, searchPlaceHolder, showSearch, ...others } = this.props;
    const { loading, value, treeData, expandedKeys, autoExpandParent, defaultSelectedKeys } = this.state;

    return (
      <div className="ComTree">
        <Select
          ref={(ele) => (this.select = ele)}
          onDropdownVisibleChange={this.showComboList}
          // open={showTree}
          value={value}
          allowClear={allowClear}
          placeholder={placeholder}
          onChange={this.onClearValue}
          disabled={disabled}
          {...others}
          dropdownRender={() => (
            <div className={cls('seid-combo-tree')} ref={(ref) => this.initComboList(ref)}>
              {showSearch ? (
                <div className="action-bar">
                  <Search
                    ref={(node) => (this.searchInput = node)}
                    placeholder={searchPlaceHolder}
                    onChange={this.handlerSearchChange}
                    onSearch={this.onSearch}
                    onPressEnter={this.onSearch}
                  />
                </div>
              ) : null}
              <div className="list-body">
                <Skeleton loading={loading} active>
                  <Scrollbars style={{ height: 220 }}>
                    {treeData && treeData.length === 0 ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      <Tree
                        autoExpandParent={autoExpandParent}
                        expandedKeys={expandedKeys}
                        defaultSelectedKeys={defaultSelectedKeys}
                        onExpand={this.onExpand}
                        onSelect={this.onSelect}
                        treeData={this.renderTreeNodes(treeData)}
                      />
                    )}
                  </Scrollbars>
                </Skeleton>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

ComTree.propTypes = {};

ComTree.defaultProps = {
  disabled: false,
  showSearch: true,
  store: null,
  dataSource: [],
  allowClear: false,
  placeholder: '',
  searchPlaceHolder: '',
  searchProperties: ['code', 'name'],
  rowKey: 'id',
  name: '',
  field: [],
};
