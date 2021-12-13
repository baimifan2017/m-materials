import FormItem from '@m-materials/form-item';
import React, { Component } from 'react';


const { 
  FormRowWrapper,
  TimePickerItem, DatePickerItem,
  MonthPickerItem, RangePickerItem,
  TextItem, InputAreaItem, InputItem, InputNumberItem,
  RadioGroupItem, SelectItem, SwitchItem
} = FormItem

class Demo extends Component {
  constructor(props){
    this.formRef = React.createRef()
  }


  onGetFormProps = () => {
    console.log(this.formRef.current)
  }

  render() {

    return (
      <FormRowWrapper ref={this.formRef}>
        <TimePickerItem name='TimePicker' code='TimePicker' />
        <DatePickerItem name='DatePickerItem' code='DatePickerItem' />
        <MonthPickerItem name='MonthPickerItem' code='MonthPickerItem' />
        <RangePickerItem name='RangePickerItem' code='RangePickerItem' />
        <TextItem name='TextItem' code='TextItem' initialValue='TextItem' />
        <InputItem name='InputItem' code='InputItem' initialValue='TextItem' />
        <InputNumberItem name='InputNumberItem' code='InputNumberItem' initialValue='1' />
        <SwitchItem name='SwitchItem' code='SwitchItem' />
        <SelectItem name='SwitchItem' code='SwitchItem'
          options={[
            { value: 'option1', text: 'option1' },
            { value: 'option2', text: 'option2' },
          ]}
        />
        <RadioGroupItem name='RadioGroupItem' code='RadioGroupItem'
          options={[
            { value: 'radio1', text: 'radio1' },
            { value: 'radio2', text: 'radio2' },
          ]}
        />

        <InputAreaItem name='InputAreaItem' code='InputAreaItem' initialValue='TextItem' />
      </FormRowWrapper>
    );
  }
}

export default Demo;


