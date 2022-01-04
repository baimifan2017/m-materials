---
title: 增加form属性
order: 3
---

ComList 、ComGrid 、ComTree 都可以配合 Form 表单使用，使用方法一致。

> antd 3.x 与 antd 4.x 系列传入 form 属性方式存在差异。

```
  import { Form } from "antd";
  // 3.x 系列
  @Form.create();

  // 4.x 系列 
  const [form] = Form.useForm;
```
> 不推荐使用，尽量使用组件FormItem （@m-materials/form-item）

```jsx
<DemoCode src="./FormItem.jsx" />
```
