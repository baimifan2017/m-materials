## 物料开发说明

## 开发文档地址
MarkDown语法文档 [Markdown语法](https://markdown.com.cn "最好的markdown教程")。

物料开发帮助文档 [物料开发帮助文档](https://appworks.site/materials/about.html "物料开发帮助文档地址")。


## 开发步骤

1 全局安装工具
```
    npm install iceworks-cli -g
```

2 新增区块
```
    iceworks add block
```

3 发布npm
```
   npm publish
```

> **_注意_**：

       1.发布scope包必须建立组织


4 发发布物料市场
```
    iceworks sync
```

> **_注意_**：

       1.物料市场使用https://fusion.design/

       2.登录账号为淘宝账号

       3.执行sync时候需要提供token


# lerna



避免npm对lock文件的修改即可

```json

"command":{
    "bootstrap":{
      "npmClientArgs":[
        "--no-package-lock"
      ]
    }
  }

```


