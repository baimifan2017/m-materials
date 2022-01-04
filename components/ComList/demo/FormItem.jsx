import React, { Component } from 'react';
import { Form, Button,Input } from 'antd';
import ComList from '@m-materials/com-list';


class FormItemWithClass extends Component {
  formRef = React.createRef();

  onSubmit = () => {
    console.log(this.formRef.current?.getFieldsValue('Note'))
  }

  render() {

    const combProps = {
      dataSource: [
        { title: '张三', code: 'zs' },
        { title: '李四', code: 'ls' },
      ],
      reader: {
        name: 'title',
        description: 'code',
      },
      name:'title',
      defaultValue: '张三',
      pagination: false,
    };
    return (
      <>
        <Button onClick={this.onSubmit}>获取ComList内容</Button>
        <div style={{ width: '200px' }}>
          <Form ref={this.formRef}>
            <Form.Item name="note" label="Note" rules={[{ required: true }]}>
              <ComList {...combProps} />
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }
}

export default FormItemWithClass