import React from 'react';
import PropTypes from 'prop-types';
import StandardFormItem from './StardardFormItem';

export const TextItem = props => {
  return <StandardFormItem {...props} type="text" />;
};
export const TimePickerItem = props => {
  return <StandardFormItem {...props} type="timePicker" />;
};
export const DatePickerItem = props => {
  return <StandardFormItem {...props} type="datePicker" />;
};
export const DatePickerNewItem = props => {
  return <StandardFormItem {...props} type="datePickerNew" />;
};
export const RadioGroupItem = props => {
  return <StandardFormItem {...props} type="radio" />;
};
export const SelectItem = props => {
  return <StandardFormItem {...props} type="select" />;
};
export const InputNumberItem = props => {
  const extProps = { ...(props || {}) };
  if (extProps.onBlur) {
    Object.assign(extProps, {
      onBlurPlus: extProps.onBlur,
    });
  }
  return <StandardFormItem {...extProps} type="inputNumber" />;
};
export const UploadFileItem = props => {
  return <StandardFormItem {...props} type="upload" />;
};
export const CheckboxItem = props => {
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    rules: [{ required: false, message: '' }],
  });
  return <StandardFormItem {...extProps} type="checkbox" />;
};
export const InputItem = props => {
  // 补丁，消除没有rules无法填写的问题
  const extProps = { ...(props || {}) };
  if (!props.rules) {
    Object.assign(extProps, {
      rules: [{ required: false, message: '' }],
    });
  }
  return <StandardFormItem {...extProps} type="input" />;
};
export const RangePickerItem = props => {
  return <StandardFormItem {...props} type="rangePicker" />;
};
export const MonthPickerItem = props => {
  return <StandardFormItem {...props} type="monthPicker" />;
};
export const ButtonItem = props => {
  return <StandardFormItem {...props} type="button" />;
};
export const InputGroupItem = props => {
  return <StandardFormItem {...props} type="input" />;
};
export const InputAreaItem = props => {
  return <StandardFormItem {...props} type="textArea" />;
};
export const SwitchItem = props => {
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    rules: [{ required: false, message: '' }],
  });
  return <StandardFormItem {...extProps} type="switch" />;
};
export const ComboListItem = props => {
  return <StandardFormItem {...props} type="comboList" />;
};
export const ComboGridItem = props => {
  return <StandardFormItem {...props} type="comboGrid" />;
};
export const ComboTreeItem = props => {
  return <StandardFormItem {...props} type="comboTree" />;
};
export const CustomizeItem = props => {
  if (!props.headStyle) {
    return <StandardFormItem {...props} />;
  }
  const extProps = { ...(props || {}) };
  Object.assign(extProps, {
    name: props.headStyle ? <span style={props.headStyle}>{props.name}</span> : props.name,
  });
  return <StandardFormItem {...extProps} />;
};
// 开发环境使用
const propTypes = {
  maxLength: PropTypes.number,
  form: PropTypes.object.isRequired,
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
MonthPickerItem.prototype = propTypes;
DatePickerNewItem.prototype = propTypes;
ComboGridItem.prototype = propTypes;
ComboListItem.prototype = propTypes;
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
ComboTreeItem.prototype = propTypes;
