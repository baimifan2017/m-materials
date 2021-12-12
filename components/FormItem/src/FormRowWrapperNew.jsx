/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
/**
 * @Description:
 * @Author: Pengxu
 * @Date: 2019/3/27
 */
import React from 'react';
import { Row } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
// 检查是否需要克隆组件，减少渲染
function checkNeedClone({ item, props }) {
  // 如果明显不能操作，也设置了必填，组件纠错
  if (
    item.props.disabled === !!item.props.required ||
    item.props.hidden === !!item.props.required
  ) {
    return true;
  }
  if (props.isDetail !== item.props.disabled) {
    return true;
  }
  // 如果是明细，需要把必填给取消掉
  const { isDetail } = props;
  if (isDetail) {
    if (item.props.rules && item.props.rules.required) {
      return true;
    }
  } else {
    // 不是明细，有校验规则也需要克隆
    if (item.props.validator) {
      return true;
    }
  }
  return false;
}
function handleAddItem(item) {
  // 将用span包含的子元素取出来
  if (item.type && (item.type === 'span' || item.type === 'Row' || item.type === 'Tooltip')) {
    for (const childItem of item.props.children) {
      if (childItem) {
        return childItem;
      }
    }
  } else {
    return item;
  }
}
export function FormRowWrapperNew(props) {
  const contentArray = [];
  const content = props.children;
  // 将FormItem分组并重新渲染
  if (_.isArray(content)) {
    for (const item of content) {
      if (_.isArray(item)) {
        for (let k = 0; k < item.length; k++) {
          contentArray.push(handleAddItem(item[k]));
        }
      } else if (item) {
        contentArray.push(handleAddItem(item));
      }
    }
  } else {
    contentArray.push(handleAddItem(content));
  }
  // 实现span超过24自动加Row换行
  const renderContent = [];
  let lineSpanSum = 0;
  for (let i = 0; i < contentArray.length; i++) {
    if (contentArray[i].props.hidden || _.isArray(contentArray[i])) {
      lineSpanSum += 0;
    } else {
      const span = contentArray[i].props.span || 8;
      let addNumber = 0;
      if (parseInt((lineSpanSum + span - 1) / 24) - parseInt(lineSpanSum / 24) === 1) {
        addNumber = parseInt((lineSpanSum + span) / 24) * 24 - lineSpanSum;
      }
      lineSpanSum += contentArray[i].props.span || 8;
      lineSpanSum += addNumber;
    }
    const j = parseInt((lineSpanSum - 1) / 24);
    if (!renderContent[j]) {
      renderContent[j] = [];
    }
    renderContent[j].push(contentArray[i]);
  }
  return (
    <span>
      {renderContent.map((renderItem, index) => {
        return (
          <Row key={index}>
            {renderItem.map(item => {
              // 为每个元素设置唯一key
              if (item.props && item.props.code) {
                item = React.cloneElement(item, {
                  key: item.props.code,
                });
              }
              // 合法的组件才需要这个步骤
              // 代理组件的明细的处理
              // 如果是ignoreDetail为true则忽略明细的代理
              if (!item.props.ignoreDetail) {
                if (checkNeedClone({ item, props })) {
                  item = React.cloneElement(item, {
                    disabled: props.isDetail || item.props.disabled,
                    rules:
                      props.isDetail || item.props.disabled || item.props.hidden
                        ? [{ required: false, message: '' }]
                        : item.props.rules || [{ required: false, message: '' }],
                    validator:
                      props.isDetail || item.props.disabled ? null : item.props.validator || null,
                  });
                }
              }
              if (
                item.props.disabled === !!item.props.required ||
                item.props.hidden === !!item.props.required
              ) {
                return React.cloneElement(item, {
                  rules:
                    item.props.disabled || item.props.hidden
                      ? [{ required: false, message: '' }]
                      : item.props.rules || [{ required: false, message: '' }],
                });
              }
              return item;
            })}
          </Row>
        );
      })}
    </span>
  );
}
FormRowWrapperNew.propTypes = {
  isDetail: PropTypes.bool,
};
