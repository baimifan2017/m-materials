# FormItem

@m-materials/form-item

基于 antd 中 form 表单，加入了自定义组件，以简化代码为模板。

当前组件基于 antd 4.x
在 4.x 中已经废弃了 fom.createForm() 、 getFieldDecorator 等 api。为了方便统一获取 form 属性在 FormRow 中已经内置了 form，可以通过：
this.formRef = React.createRef()
进行获取

## API


## Form
接收antd 4.x 系列中Form所有参数[Form配置项](https://ant.design/components/form-cn/#Form)


| 参数名        | 说明                        | 必填    | 类型   | 默认值      | 备注        |
| -------------| -------------------------  | ------ | ------ | ---------- | ---------- |
| ref          | 通过ref获取form实例          | false   | React.createRef() | 无         |            |
| name         | form实例名                 | false   | string | 无         |            |
| span         | 子元素宽度，span={24}每行一个元素 | false   | string | 8      |            |
| idDetail     | 全局disabled属性            | false  | boolean| false         |            |




## Form.Item
| 参数名        | 说明                        | 必填    | 类型   | 默认值      | 备注        |
| -------------| -------------------------  | ------ | ------ | ---------- | ---------- |
| code         | code                       | true   | string | 无         |            |
| label        | label（名称）                | true   | string | 无         |            |
| initialValue | 默认值                      | false   | string | 无         |            |
| disabled     | disabled属性                | false  | boolean| 无         |            |
| options      | ComGridItem、ComTree、SelectItem、RadioGroupItem用数据源[配置项](#OptionProps)| false  | object | 无         |            |
| span         | 修改行宽                    | false  | Number  | 无         |            |
| formLayout   | 单独修改每行labelCol、 wrapperCol布局| false  | Number  | 无         |            |



## OptionProps

| 参数名        | 说明                        | 必填    | 类型   | 默认值      | 备注        |
| -------------| -------------------------  | ------ | ------ | ---------- | ---------- |
| name         | 选项名称                     | true   | string | 无         |            |
| code         | 选项值value                 | true   | string | 无         |            |
