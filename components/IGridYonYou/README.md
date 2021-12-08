# IGrid

@m-materials/i-grid-yon-you

根据tinper-bee中ac-gridcn再封装

## API

| 参数名          | 说明              | 必填     | 类型    | 默认值   | 备注   |
| -------------- | ---------------  | -------- | ------ | ------ | ---- |
| columns        | Table中columns    |必填      | Array  | 无      |      |      
| dataSource     | 本地传入数据        |非必填     | Array  | 无     | dataSource（本地数据）与store只用配置一个（远程请求）|      
| pagination     | 分页信息           |非必填     | Object  | {current:1,pageSize：15}|      |     
| store          | 远程数据配置        |非必填     | Object  | 无    |      |     
| position       | 分页位置           |非必填     | array   | ['bottomRight']    |      |     


## store 远程请求配置

| 参数名          | 说明              | 必填     | 类型    | 默认值   | 备注   |
| -------------- | ---------------  | -------- | ------ | ------ | ---- |
| url            | 请求地址           |必填      | string  | 无      |      |      
| method         | 请求方式           |非必填     | string | 'post'  | axios请求方式 |      
| params         | 请求时需要传入的额外参数|非必填   | Object  |      |      |     
| resMapping     | 响应数据映射        |非必填     | Object  | 无    |      |     


## resMapping 数据响应映射

- 不同的请求接口响应数据的封装形式可能不一致，但是无论何种形式组件最终需要pagination(分页信息) 、content（数据）
- resMapping 用于配置组件中的分页信息、以及数据应该取返回实体中的具体字段路径。

| 参数名          | 说明              | 必填     | 类型    | 默认值   | 备注   |
| -------------- | ---------------  | -------- | ------ | ------ | ---- |
| content        | 数据字段          |非必填     | object  |       |      |      
| current        | 当前页            |非必填     | string  | 'current'        |     |     
| total          | 总页数            |非必填     |  string | 'total'      |      |      
| pageSize       | 每页多少条         |非必填     | string  | 'pageSize'     |       |  

