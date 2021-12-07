# ComGrid

@m-materials/com-grid

下拉table组件

## API

| 参数名 | 说明 | 必填 | 类型 | 默认值 | 备注 |
| ------ | ---- | ---- | ---- | ------ | ---- |
|        |      |      |      |        |      |




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
