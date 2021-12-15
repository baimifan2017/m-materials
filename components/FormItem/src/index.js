import PropTypes from 'prop-types';
import React from 'react';
import { FormRowWrapper } from './FormRowWrapper';
import StandardFormItem from './StandardFormItem';

const TextItem = props => {
  return <StandardFormItem {...props} type="text" />;
};

const TimePickerItem = props => {
  return <StandardFormItem {...props} type="timePicker" />;
};

const DatePickerItem = props => {
  return <StandardFormItem {...props} type="datePicker" />;
};

const DatePickerNewItem = props => {
  return <StandardFormItem {...props} type="datePickerNew" />;
};

const RadioGroupItem = props => {
  return <StandardFormItem {...props} type="radio" />;
};

const SelectItem = props => {
  return <StandardFormItem {...props} type="select" />;
};

const InputNumberItem = props => {
  const extProps = { ...(props || {}) };
  if (extProps.onBlur) {
    Object.assign(extProps, {
      onBlurPlus: extProps.onBlur,
    });
  }
  return <StandardFormItem {...extProps} type="inputNumber" />;
};

const UploadFileItem = props => {
  return <StandardFormItem {...props} type="upload" />;
};

const CheckboxItem = props => {
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    rules: [{ required: false, message: '' }],
  });
  return <StandardFormItem {...extProps} type="checkbox" />;
};

const InputItem = props => {
  // 补丁，消除没有rules无法填写的问题
  const extProps = { ...(props || {}) };
  if (!props.rules) {
    Object.assign(extProps, {
      rules: [{ required: false, message: '' }],
    });
  }
  return <StandardFormItem {...extProps} type="input" />;
};

const RangePickerItem = props => {
  return <StandardFormItem {...props} type="rangePicker" />;
};

const MonthPickerItem = props => {
  return <StandardFormItem {...props} type="monthPicker" />;
};

const ButtonItem = props => {
  return <StandardFormItem {...props} type="button" />;
};

const InputGroupItem = props => {
  return <StandardFormItem {...props} type="input" />;
};

const InputAreaItem = props => {
  return <StandardFormItem {...props} type="textArea" />;
};

const SwitchItem = props => {
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    rules: [{ required: false, message: '' }],
  });
  return <StandardFormItem {...extProps} type="switch" />;
};

const ComboListItem = props => {
  return <StandardFormItem {...props} type="comboList" />;
};

const ComGridItem = props => {
  return <StandardFormItem {...props} type="comGrid" />;
};

const ComTreeItem = props => {
  return <StandardFormItem {...props} type="comTree" />;
};


const CustomizeItem = props => {
  if (!props.headStyle) {
    return <StandardFormItem {...props} />;
  }
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    name: props.headStyle ? <span style={props.headStyle}>{props.name}</span> : props.name,
  });
  return <StandardFormItem {...extProps} />;
};


export default {
  TextItem,
  SwitchItem,
  InputItem,
  InputNumberItem,
  InputAreaItem,
  DatePickerItem,
  RangePickerItem,
  TimePickerItem,
  MonthPickerItem,
  DatePickerNewItem,
  ComGridItem,
  ComTreeItem,
  SelectItem,
  RadioGroupItem,
  FormRowWrapper
}
// 开发环境使用
const propTypes = {
  maxLength: PropTypes.number,
  // form: PropTypes.object.isRequired,
  code: PropTypes.any.isRequired,
  categoryCode: PropTypes.string,
  name: PropTypes.any,
  initialValue: PropTypes.any,
  formLayout: PropTypes.any,
  rules: PropTypes.any,
  config: PropTypes.object,
  onChange: PropTypes.func,
  span: PropTypes.number,
  placeholder: PropTypes.string,
  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  selectChange: PropTypes.func,
  precision: PropTypes.number,
  desc: PropTypes.any,
  params: PropTypes.any,
  options: PropTypes.any,
  allowClear: PropTypes.any,
  ignoreDetail: PropTypes.bool,
  thousandth: PropTypes.bool,
  textValue: PropTypes.string,
  validator: PropTypes.any,
  text: PropTypes.any,
  onClick: PropTypes.func,
  inputType: PropTypes.string,
  columns: PropTypes.array,
  afterSelect: PropTypes.func,
  tooltip: PropTypes.string,
};
// MonthPickerItem.prototype = propTypes;
// DatePickerNewItem.prototype = propTypes;
// ComGridItem.prototype = propTypes;
// ComTreeItem.prototype = propTypes;
// ComListItem.prototype = propTypes; todo
InputItem.propTypes = propTypes;
CheckboxItem.propTypes = propTypes;
UploadFileItem.propTypes = propTypes;
InputNumberItem.propTypes = propTypes;
RadioGroupItem.propTypes = propTypes;
DatePickerItem.propTypes = propTypes;
SelectItem.propTypes = propTypes;
RangePickerItem.propType = propTypes;
ButtonItem.prototype = propTypes;
InputGroupItem.prototype = propTypes;
InputAreaItem.prototype = propTypes;
SwitchItem.prototype = propTypes;
