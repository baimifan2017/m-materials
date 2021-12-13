import FormItem from '@m-materials/form-item';
import { Button, Form } from 'antd';
import React, { Component } from 'react';

const { FormRowWrapper, TimePickerItem } = FormItem

const [form] = Form.useForm();

class Demo extends Component {

  render() {

    const commProps = {
      // form
    }
    return (
        <FormRowWrapper>
          <Button>123</Button>
          <TimePickerItem {...commProps} />
        </FormRowWrapper>
    );
  }
}

export default Demo;