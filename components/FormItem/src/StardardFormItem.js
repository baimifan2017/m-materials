

/**
 * @description 标准化中间组件
 * @author 彭旭
 * @date 2018.12.19
 */
import React, { PureComponent } from 'react';
import {
  Form,
  Radio,
  Switch,
  InputNumber,
  Col,
  Input,
  TimePicker,
  DatePicker,
  Checkbox,
  Tooltip,
  Select,
  Button,
  message,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { ComboGrid, ComboList, ComboTree, MoneyInput } from 'suid';
import { CustomDatePicker } from './CustomDatePicker';
import { getObjData } from '../../utils/methods';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const { Option } = Select;
const currencyCodeStyleLeft = { width: '60%' };
const currencyCodeStyleRight = { width: '37%', marginLeft: '3%' };
const packageComponents = 'comboGrid comboList comboTree';

// 标准formItem组件和平台组件参数冲突转换
function changeParams(item, type) {
  // 补充默认清空函数
  if (item.afterSelect && !item.afterClear) {
    item.afterClear = () => {
      item.afterSelect({});
    };
  }
  if (item.reader) {
    item.name = item.reader.parseName && item.reader.parseName;
    item.field = item.reader.parseField && item.reader.parseField;
    if (getObjData(item, 'store.url', '').includes('ByPage')) {
      item.remotePaging = true;
    }
    if (type === 'comboList') {
      // 根据配置的render自动计算快速搜索值
      if (!item.searchProperties) {
        let searchProperties = [];
        searchProperties.push(item.reader.name);
        if (item.reader.description) {
          searchProperties.push(item.reader.description);
        }
        item.searchProperties = searchProperties;
      }
    } else if (type === 'comboGrid') {
      // 根据配置的columns自动计算快速搜索值
      if (item.columns && !item.searchProperties) {
        item.searchProperties = item.columns
          .filter(col => !col.ignoreSearch && !col.dataIndex.includes('Remark'))
          .map(subItem => subItem.dataIndex);
      }
      // 根据配置的columns自适应计算宽度
      if (item.columns && !item.width) {
        let needConfigWidth = true;
        let width = 0;
        for (let subItem of item.columns) {
          if (!subItem.width || subItem.width.toString().includes('%')) {
            needConfigWidth = false;
            break;
          } else {
            width += parseInt(subItem.width);
          }
        }
        if (needConfigWidth) {
          item.width = width;
        }
      }
    }
    const { parseName, parseField, ...propsItem } = item;
    return propsItem;
  }
  return item;
}

// 初始化parseField的值
function initFieldValue(reader, form) {
  const { getFieldDecorator } = form;
  const { parseField = [], editData = {} } = reader;
  for (let key of parseField) {
    getFieldDecorator(key, {
      initialValue: getObjData(editData, key),
    });
  }
}

// 初始化parseField的值
function initFieldArrayValue(reader, form) {
  const { getFieldDecorator } = form;
  const { parseField = [], initialField = {} } = reader;
  for (let [index, key] of parseField.entries()) {
    getFieldDecorator(key, {
      initialValue: initialField[index],
    });
  }
}

class StandardFormItem extends PureComponent {
  // 本地化数据，减少渲染次数
  ItemConfig = {};

  ItemRule = [];

  formLayoutTemp = {};

  itemSpan = 8;

  defaultFormLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  getItem = (item, type) => {
    let rest = _.omit(item, ['newKey']);
    // 如果是平台组件
    if (packageComponents.includes(type)) {
      // 对接平台组件参数转换
      // 为每一个field赋值
      if (rest.reader.hasOwnProperty('editData') && rest.form) {
        if (_.isArray(rest.reader.editData)) {
          rest.reader.initialField = rest.reader.editData;
          initFieldArrayValue(rest.reader, rest.form);
        } else {
          initFieldValue(rest.reader, rest.form);
        }
      }
      if (rest.allowClear === false) {
        rest.allowClear = false;
      } else {
        rest.allowClear = true;
      }
      rest = changeParams(rest, type);
    } else {
      rest = _.omit(item, [
        'rowKey',
        'remotePaging',
        'cascadeParams',
        'afterSelect',
        'doAfterSelect',
        'searchProperties',
      ]);
    }
    switch (type) {
      case 'timePicker':
        return <TimePicker style={{ width: '100%' }} {...rest} />;
      case 'datePicker':
        if (!rest.format) {
          rest.format = 'YYYY-MM-DD';
        }
        return <DatePicker style={{ width: '100%' }} {...rest} />;
      case 'datePickerNew':
        rest.onChange && (rest.originOnchange = rest.onChange);
        rest.onChange && delete rest.onChange;
        return <CustomDatePicker {...rest} />;
      case 'rangePicker':
        return <RangePicker style={{ width: '100%' }} {...rest} />;
      case 'monthPicker':
        return <MonthPicker style={{ width: '100%' }} {...rest} />;
      case 'select':
        let options = [...rest.options];
        let newOptions = options.map(function(value) {
          return (
            <Option key={value.value} value={value.value}>
              {value.text}
            </Option>
          );
        });
        if (rest.allowClear === false) {
          rest.allowClear = false;
        } else {
          rest.allowClear = true;
        }
        return (
          <Select {...rest} style={{ width: '100%' }}>
            {newOptions}
          </Select>
        );
      case 'radio':
        options = [...rest.options];
        newOptions = options.map(function(value) {
          return (
            <Radio key={value.value} value={value.value}>
              {value.text}
            </Radio>
          );
        });
        return <RadioGroup {...rest}>{newOptions}</RadioGroup>;
      case 'inputNumber':
        let commonProps = {
          style: { width: '100%' },
          min: rest.min || -9999999999999,
          max: rest.max || 9007199254740992,
          precision: rest.hasOwnProperty('precision') ? rest.precision : 2,
        };
        // 千分位统一设置
        if (rest.thousandth) {
          rest.suffix = rest.suffix || '';

          // 千分位代理onBlur方法
          function onBlurPlus(e) {
            let obj = {};
            obj.target = {};
            obj.target.value = parseInt(`${e.target.value}`.replace(/\$\s?|(,*)/g, ''));
            rest.onBlurPlus(obj);
          }

          rest.onBlur && (rest.onBlur = onBlurPlus);
          return <MoneyInput {...rest} {...commonProps} />;
        }
        if (rest.percent) {
          rest.formatter = value => `${value}%`;
          rest.parser = value => value.replace('%', '');
        }
        return <InputNumber {...rest} {...commonProps} />;
      case 'textArea':
        const { rows } = rest;
        return <Input.TextArea rows={rows || 4} maxLength={1500} {...rest} />;
      case 'checkbox':
        return <Checkbox {...rest}>{rest.text}</Checkbox>;
      case 'input':
        rest.type = rest.inputType;
        rest.inputType && delete rest.inputType;
        return <Input autoComplete="off" maxLength={128 || rest.maxLength} {...rest} />;
      case 'button':
        rest.type = rest.buttonType;
        rest.buttonType && delete rest.buttonType;
        return (
          <Button {...rest} style={rest.style || { width: '100%' }}>
            {rest.text}
          </Button>
        );
      case 'text':
        return <span style={rest.style}>{rest.text}</span>;
      case 'switch':
        return <Switch size={rest.size || 'small'} {...rest} />;
      case 'comboList':
        return <ComboList {...rest} style={rest.style || { width: '100%' }} />;
      case 'comboTree':
        return <ComboTree {...rest} style={rest.style || { width: '100%' }} />;
      case 'comboGrid':
        return (
          <ComboGrid
            style={rest.style || { width: '100%' }}
            columns={
              rest.columns || [
                {
                  title: '代码',
                  width: '50%',
                  dataIndex: 'code',
                },
                {
                  title: '名称',
                  width: '50%',
                  dataIndex: 'name',
                },
              ]
            }
            searchProperties={rest.searchProperties}
            rowKey={rest.rowKey}
            {...rest}
          />
        );
      default:
    }
  };

  validatorFunc = (rule, value, callback) => {
    const min = this.props.min || 0;
    const { banEQ } = this.props;
    if (banEQ && (value === 0 || value) && value <= min) {
      callback(`值不能小于等于${min}!`);
    } else if (value && value < min) {
      callback(`值不能小于${min}!`);
    } else {
      callback();
    }
  };

  validatorWrap = (rule, value, callback) => {
    this.props.validator(rule, value, callback);
    callback();
  };

  render() {
    const {
      noFormControl,
      span,
      name,
      noToolTip,
      code,
      hidden,
      type,
      rules,
      form,
      validator,
      ...tempItem
    } = this.props;
    let { initialValue, formLayout, maxLength, ...item } = tempItem;
    let { reader } = item;
    let decoratorCode = code;
    // 如果是平台组件，需要接受form
    if (packageComponents.includes(type)) {
      item.form = form;
      if (!reader) {
        message.error(`${name}【${code}】没有配置reader，请检查！`);
        return null;
      }
      decoratorCode = reader.parseName || reader.name;
    }
    this.itemSpan = span || this.itemSpan;
    // 设置item的布局
    this.formLayoutTemp = formLayout || this.defaultFormLayout;
    // 设置item的基础设置
    // 设置规则
    this.ItemRule = rules || this.ItemRule;
    // 设置初始值
    if (type === 'datePicker') {
      // 时间选择器，如果是时间，如果没有加moment转换，自动加上
      if (typeof initialValue === 'string') {
        initialValue = moment(initialValue);
      }
    }
    // 设置初始值
    if (type === 'datePickerNew') {
      // 时间选择器，如果是时间，如果没有加moment转换，自动加上
      if (initialValue && typeof initialValue !== 'string') {
        const format = item.format || 'YYYY-MM-DD hh:mm:ss';
        initialValue = initialValue.format(format);
      }
    }
    if (type === 'checkbox' || type === 'switch') {
      this.ItemConfig.initialValue = !!initialValue;
    } else {
      this.ItemConfig.initialValue = initialValue;
    }
    if (type === 'inputNumber') {
      this.validator = validator ? this.validatorWrap : this.validatorFunc;
      this.ItemRule.push({ validator: this.validator });
    } else if (validator) {
      this.ItemRule.push({ validator: this.validatorWrap });
    }
    if (type === 'input') {
      if (maxLength) {
        this.ItemRule.push({ max: maxLength, message: `${name}的长度不能大于${maxLength}!` });
      }
    }
    this.ItemConfig.rules = this.ItemRule;
    if (type === 'checkbox' || type === 'switch') {
      this.ItemConfig.valuePropName = 'checked';
    }
    if (item.currencyCode) {
      item.style = currencyCodeStyleLeft;
    }
    let needFormWrapper = true;
    let formContent = this.getItem(item, type);
    if (type === 'button' || type === 'text' || noFormControl) {
      needFormWrapper = false;
    }
    // 判断是否加入form控制
    if (needFormWrapper) {
      formContent = (
        <span>{form.getFieldDecorator(decoratorCode, this.ItemConfig)(formContent)}</span>
      );
    } else {
      formContent = <span>{formContent}</span>;
    }
    let content = (
      <Col key={`${code}_col`} span={this.itemSpan} style={{ display: hidden ? 'none' : 'block' }}>
        <FormItem key={code} label={name} {...this.formLayoutTemp}>
          {formContent}
          {item.currencyCode && (
            <Input disabled value={item.currencyCode} style={currencyCodeStyleRight} />
          )}
        </FormItem>
      </Col>
    );
    let value = '';
    if (needFormWrapper) {
      value = form.getFieldValue(decoratorCode) || '';
    }
    if ((item.tooltip || type === 'input' || type === 'text') && !noToolTip) {
      let title = item.tooltip || '';
      const text = (item.text && item.text) || '';
      if ((value.length > 15 && item.disabled) || text.length > 12) {
        title = title || value || text;
      }
      if (title) {
        content = <Tooltip title={title}>{content}</Tooltip>;
      }
    }
    return content;
  }
}

export default StandardFormItem;
