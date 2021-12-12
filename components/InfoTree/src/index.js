import React from 'react';
import axios from 'axios';
import { Input, message, Tree } from 'antd';
import { get } from 'lodash';
import './index.css';

const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

// @ts-ignore
const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};

generateData(z);

const dataList = [];
const generateList = (data, myKey = 'key', myTitle) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    let params = {};
    params[myKey] = node[myKey];
    params[myTitle] = node[myTitle];
    dataList.push(params);
    if (node.children) {
      generateList(node.children, myKey, myTitle);
    }
  }
};
// generateList(gData);

const getParentKey = (key, tree, myKey) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item[myKey] === key)) {
        parentKey = node[myKey];
      } else if (getParentKey(key, node.children, myKey)) {
        parentKey = getParentKey(key, node.children, myKey);
      }
    }
  }
  return parentKey;
};

export default class InfoTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    dataSource: [],
  };

  handleFindTree = () => {
    const { store = {}, dataSource } = this.props;
    const { url, option } = store;
    if (url) {
      axios(url, {
        method: get(option, 'method', 'get'),
      }).then((r) => {
        const { success, data, msg } = r;
        if (success) {
          this.setState({
            dataSource: data,
          });
          const { myKey, myTitle } = this.props;
          generateList(data, myKey, myTitle);
        } else {
          message.error(msg, 3);
        }
      });
    } else if (dataSource && Array.isArray(dataSource)) {
      debugger;
      this.setState({ dataSource: dataSource });
    }
  };

  componentDidMount() {
    this.handleFindTree();
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { dataSource } = this.state;
    const { myTitle, myKey } = this.props;
    const { value } = e.target;

    const expandedKeys = dataList
      .map((item) => {
        if (item[myTitle].indexOf(value) > -1) {
          return getParentKey(item[myKey], dataSource, myKey);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, dataSource } = this.state;
    const { header, myTitle, myKey, onSelect, renderItemExtra } = this.props;

    const loop = (data) =>
      data.map((item) => {
        const index = item[myTitle].indexOf(searchValue);
        const beforeStr = item[myTitle].substr(0, index);
        const afterStr = item[myTitle].substr(index + searchValue.length);
        const temTitle =
          index > -1 ? (
            <span style={{ width: '100%' }} onClick={() => onSelect(item)}>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}

              {renderItemExtra && (
                <span style={{ marginLeft: 12 }} className="operate">
                  {renderItemExtra(item)}
                </span>
              )}
            </span>
          ) : (
            <span v-data={item} onClick={() => onSelect(item)}>
              {item[myTitle]}
            </span>
          );
        if (item.children) {
          return {
            title: temTitle,
            key: item[myKey],
            children: loop(item.children),
          };
        }

        return {
          title: temTitle,
          key: item[myKey],
        };
      });

    return (
      <React.Fragment>
        <div className="search-box">
          {get(header, 'left') ? (
            header?.left
          ) : (
            <Search
              style={!get(header, 'right') ? { marginBottom: 8 } : { marginRight: 2, width: '80%' }}
              placeholder="请输入查询"
              onChange={this.onChange}
            />
          )}
          {get(header, 'right') ? header?.right : null}
        </div>
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(dataSource)}
        />
      </React.Fragment>
    );
  }
}

InfoTree.propTypes = {
  myKey: 'key',
  myTitle: 'title',
};

InfoTree.defaultProps = {};
