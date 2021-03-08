<h1 align="center">Welcome to react-antd-treetable 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

## 介绍

基于 antd Table 组件封装，比较适合用于展示堆栈信息。

主要扩展的能力：

1. 层级缩进**指示线**
2. **远程懒加载**子节点
3. 子节点**分页**
4. 子节点**筛选**
5. 子节点**空提示**

这些功能全部通过插件实现，其他的 `props` 全部继承自 Ant Design 的 Table 组件。

![预览](https://images.gitee.com/uploads/images/2021/0308/152445_3a1c6f47_1087321.gif "Kapture 2021-03-08 at 15.24.07.gif")

## 用法

需要依赖 `antd`, `@ant-design/icons`

```sh
npm i react-antd-treetable -S
```

最简单用法和 antd 的 Table 组件完全一致，数据中带有 `children` 字段即可：

```tsx
import React from 'react';
import TreeTable from 'react-antd-treetable';

const data = [
  {
    name: 'foo',
    children: [
      {
        name: 'bar',
      },
    ],
  },
];

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
];

const App = () => {
  return <TreeTable rowKey="id" dataSource={data} columns={columns} />;
};

export default App;
```

## 文档

更多功能和用法请看：

https://react-antd-treetable.vercel.app/

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
