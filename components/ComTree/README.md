# 下拉树

@m-materials/com-tree

基于antd TreeSelect 下拉树结构选择器
主要增加了远程加载数据功能

## API

| 参数              | 说明                                                 | 类型                             | 默认值            | 版本 |     |
| ----------------- | ---------------------------------------------------- | -------------------------------- | ----------------- | ---- | --- |
| allowClear        | 可以点击清除图标删除内容                               | boolean                          | false             |      |     |
| afterSelect       | 选择数据行后触发该事件                                 | Function(item: T, index: number) | -                 |      |     |
| afterClear        | 清空数据触发该事件                                     | Function                         | -                 |      |     |
| afterLoaded       | 数据请求完成调用该事件，返回接口请求的数据               | Function(data: object\[])        | -                 |      |     |
| cascadeParams     | 级联参数配置                                          | object                           | -                 |      |     |
| className         | 选择框样式名                                          | string                           | -                 |      |     |
| defaultValue      | 输入框默认内容                                        | string                           | -                 |      |     |
| disabled          | 组件失效状态                                          | boolean                          | false             |      |     |
| dataSource        | 静态数据源                                            | object\[]                        | \[]               |      |     |
| field             | 额外提交的表单字段属性名，表单受控                      | string\[]                        | \[]               |      |     |
| form              | antd 表单的 form 属性,参考 antd 的[Form]组件 | WrappedFormUtils| -                 |      |     |
| name              | 填充输入框显示的表单字段属性名，表单受控                | string     |                   |      |     |
| placeholder       | 选择框默认文字                                        | string                           | -                 |      |     |
| reader            | 接口数据解析适配，参考[配置项](#Reader)                | object                           | -                 |      |     |
| rowKey            | 设置列表项唯一的 key，可以是返回字符串的字符串或函数      | Function((item: T) => string)    | string            | 'id' |     |
| style             | css 属性配置                                          | React.CSSProperties              | -                 |      |     |
| showSearch        | 显示快速搜索                                          | boolean                          | true              |      |     |
| searchPlaceHolder | 搜索框默认文字                                         | string                           | -                 |      |     |
| searchProperties  | 搜索接口数据属性配置                                   | string\[]                        | \['code', 'name'] |      |     |
| store             | 数据接口对象,参考[配置项](#StoreProps)                 | object                           | -                 |      |     |
| value             | 输入框内容                                            | string                           | -                 |      |     |
| width             | 数据面板宽度,默认与选择框同宽                           | number                           | -                 |      |     |

### StoreProps
dataSource用来配置本地数据，store用来配置远程数据请求信息。

| 参数     | 说明                 | 类型            | 默认值 | 版本 |
| -------- | -------------------- | --------------- | ------ | ---- |
| params   | 接口请求参数         | object          | -      |      |
| type     | 接口请求类型         | 'GET' \| 'POST' | GET    |      |
| url      | 接口请求地址         | string          | -      |      |
| autoLoad | 初始化时自动获取数据 | boolean         | false  |      |

### Reader

| 参数        | 说明                                         | 类型      | 默认值     | 版本 |
| ----------- | -------------------------------------------- | --------- | ---------- | ---- |
| childKey    | 子节点的属性名                               | string    | 'children' |      |
| data        | 截取的数据节点                               | string    | -          |      |
| description | 次要信息属性名                               | string    | -          |      |
| field       | ComboList 属性 field 映射,属性名必须一一对应 | string\[] | -          |      |
| name        | 显示的属性名,ComboList 属性 name 映射        | string    | -          |      |