# ComGrid

@m-materials/com-grid

下拉table组件

## API

| 参数名     | 说明                                                                                 | 必填 | 类型   | 默认值 | 备注 |
| --------- | ------------------------------------------------------------------------------------| ---- | ----- | ------ | ---- |
| columns   |列表属性配置,详情参见 antd 的[columns](https://ant.design/components/table-cn/#Column)属性| true | object|        |      |
| form      |参考 antd 的[Form](<https://ant.design/components/form-cn/#Form.create(options)>)组件  | false | object|        |      |
| afterSelect|选择数据行后触发该事件                                                  | false| (item: T, index: number)  |      |      |
| disabled    |组件失效状态                                                                         | false  | boolean |  false|      |
| showSearch  |显示快速搜索                                                                         | false  | boolean |  false|      |
| searchProperties|搜索接口数据属性配置                                                 | false  | string\[] | \['code', 'name'] |      |
| dataSource  |静态数据源                                                                         | false  | object\[] |       |      |
| defaultValue|默认值                                                                            | false  | string |       |      |
| store  | 数据接口对象,参考[配置项](#StoreProps                                                     | false  | object |       |      |
| width  | 下拉数据面板默认宽度                                                                      | false  | number |       |      |
| field  | 与Reader中的参数对应，可将其参数名称转为对应名称。                              | false | string[] |      | 一般用于form表单中获取多个自定义名称参数|
| reader | 下拉参数读取设置                                                              | false  | number |      | 一般用于form表单中获取多个自定义名称参数|

### StoreProps

| 参数     | 说明                 | 类型            | 默认值 | 版本 |
| -------- | -------------------- | --------------- | ------ | ---- |
| params   | 接口请求参数         | object          | -      |      |
| type     | 接口请求类型         | 'GET' \| 'POST' | GET    |      |
| url      | 接口请求地址         | string          | -      |      |
| autoLoad | 初始化时自动获取数据 | boolean         | false  |      |

### Reader

| 参数  | 说明                                         | 类型      | 默认值 | 版本 |
| ----- | -------------------------------------------- | --------- | ------ | ---- |
| data  | 截取的数据节点                               | string    | -      |      |
| field | ComboGrid 属性 field 映射,属性名必须一一对应 | string\[] | -      |      |
| name  | 显示的属性名,ComboList 属性 name 映射        | string    | -      |      |
