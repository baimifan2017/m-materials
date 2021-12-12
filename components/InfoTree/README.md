# 展示树

@m-materials/info-tree

一种树状结构展示

### API

| 参数            | 说明                 | 类型          | 默认值 |
| --------------- | -------------------- | ------------- | ------ |
| myKey           | 树状节点 value       | string        | -      |
| myTitle         | 树状节点 name        | string        | -      |
| onSelect        | 点击后事件           | function(row) | -      |
| renderItemExtra | 树状节点后跟其他操作 | function(row) | -      |
| header          | 树形选择器头部       | object        | -      |
| store           | 远程加载数据         | object        | -      |
| data            | 本地加载数据         | array         | -      |

#### header

- 树转选择器头部配置
  默认将头部分为了左右两个部分

| 参数      | 说明               | 类型   | 默认值 |
| --------- | ------------------ | ------ | ------ |
| left      | 树形选择器头部左侧 | string | -      |


#### store

- 远程加载

| 参数   | 说明                                      | 类型   | 默认值 |
| ------ | ----------------------------------------- | ------ | ------ |
| url    | 远程加载地址（必填）                        | string | -      |
| option | 请求配置，包含 header，method（默认 get）   | string | -      |

> **_注意_**：
