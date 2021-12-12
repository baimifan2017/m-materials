import React, { useState } from 'react';
import {DatePicker} from "antd";
import moment from "moment";
export const CustomDatePicker = (props) => {
  const [dateValue, setDateValue] = useState(undefined);
  const {value,onChange,format,originOnchange} = props;
  const triggerChange = changedValue => {
    if (onChange) {
      onChange(changedValue);
    }
  };
  const dateChange = date => {
    const originDate = date;
    if(!date){
      // originOnchange && originOnchange(originDate,date);
      triggerChange(date);
      return;
    }
    if(format==="YYYY-MM-DD") {
      date = date.format(format+" 00:00:00");
    }else if(format){
      date = date.format(format);
    }else{
      date = date.format("YYYY-MM-DD hh:mm:ss");
    }
    if(!('value' in props)){
      setDateValue(date);
    }
    originOnchange && originOnchange(originDate,date);
    triggerChange(date);
  };
  const tempValue = value||dateValue;
  let realValue = tempValue;
  if(tempValue){
    if(typeof tempValue === "string"){
      realValue = moment(tempValue)
    }
  }
  return <DatePicker
    {...props}
    style={{width: '100%'}}
    value={realValue}
    onChange={dateChange}
  />;
}
