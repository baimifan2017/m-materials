import React, { Component } from 'react';
import { Button } from 'antd';
import FormItem from '@m-materials/form-item';



const {
  FormRowWrapper,
  TimePickerItem, DatePickerItem,
  MonthPickerItem, RangePickerItem,
  InputAreaItem, InputItem, InputNumberItem,
  RadioGroupItem, SelectItem, SwitchItem,
  ComGridItem, ComTreeItem
} = FormItem

class Demo extends Component {
  constructor(props) {
    super(props)
  }
  formRef = React.createRef();

  /**
   * 执行保存
   * 注意这里是一个异步函数
   */
  onSubmit = async () => {
    try {
      const values = await this.formRef?.current.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  render() {
    const combGridProps = {
      columns: [
        { title: "姓名", dataIndex: "name", width: 180 },
        { title: "代码", dataIndex: "code", width: 180 },
      ],
      dataSource: [
        { name: "张三", code: "zs" },
        { name: "李四", code: "ls" },
      ],
      rowKey: 'code',
      reader: {
        name: 'name',
        field:['name','code']
      }
    }

    const treeData = [
      {
        title: '四川省',
        id: '0-0',
        children: [
          {
            title: '成都市',
            id: '0-0-0',
            children: [
              { title: '天府新区', id: '0-0-0-0' },
              { title: '武侯区', id: '0-0-0-1' },
              { title: '成华区', id: '0-0-0-2' },
            ],
          },
          {
            title: '绵阳市',
            id: '0-0-1',
            children: [
              { title: '高新区', id: '0-0-1-0' },
              { title: '经开区', id: '0-0-1-1' },
              { title: '江油市', id: '0-0-1-2' },
            ],
          },
          {
            title: '德阳市',
            id: '0-0-2',
          },
        ],
      }
    ];
    const comTreeProps = {
      style: { width: '100%' },
      dataSource: treeData,
      allowClear: true,
      rowKey: 'id',
      reader: {
        name: 'title',
      }
    }

    return (
      <React.Fragment>
        <FormRowWrapper ref={this.formRef} isDetail={false} span={8} name="control-ref">
          <TimePickerItem
            label='TimePicker'
            code='TimePicker'
          />
          <DatePickerItem
            label='DatePickerItem'
            code='DatePickerItem'
            disabled
          />
          <MonthPickerItem
            label='MonthPickerItem'
            code='MonthPickerItem'
            required // 必填， 也可以通过required:[{}]方式传入自定义必填信息。
          />
          <RangePickerItem label='RangePickerItem' code='RangePickerItem' />
          <InputItem
            label='InputItem'
            code='InputItem'
            initialValue='TextItem'
            maxLength={10} // 简化写法，也可以通过required:[{}] 自行定义验证信息。
          />
          <InputNumberItem label='InputNumberItem' code='InputNumberItem' initialValue='1' />
          <SwitchItem label='SwitchItem' code='SwitchItem' />
          <SelectItem label='SelectItem' code='SelectItem'
            options={[
              { value: 'option1', text: 'option1' },
              { value: 'option2', text: 'option2' },
            ]}
          />
          <RadioGroupItem label='RadioGroupItem'
            code='RadioGroupItem'
            options={[
              { value: 'radio1', text: 'radio1' },
              { value: 'radio2', text: 'radio2' },
            ]}
          />

          <ComGridItem
            label='ComGridItem'
            code='ComGridItem'
            initialValue='zs'
            {...combGridProps} />
          <ComTreeItem label='ComTreeItem' code='ComTreeItem' {...comTreeProps} />
          <InputAreaItem
            label='InputAreaItem'
            code='InputAreaItem'
            initialValue='TextItem'
            span={16}  // 所占行宽，最大24.
            formLayout={{
              labelCol: { span: 4 }, //label 宽度
              wrapperCol: { span: 20 }, // Element 宽度，labelCol、wrapperCol 两者之和应该等于24.
            }}
          />

        </FormRowWrapper>
        <Button onClick={this.onSubmit} style={{ float: 'right' }}>提交</Button>

      </React.Fragment>
    );
  }
}

export default Demo;


