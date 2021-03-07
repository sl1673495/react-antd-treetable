## 子节点懒加载

懒加载最关键的属性是 `hasNextKey`，需要和后端协商一个字段比如 `has_next` 放在树中的每个节点上，只有当这个节点还有更多子数据的情况下设置为 true。

只有标记为可以懒加载的节点才会展示**展开箭头**图标。

当点击了展开图标后，会触发 `onLoad` 函数，拿到当前点击展开的行的 `record`，请求返回对应的**子节点数组**即可，组件内部会自动把这个数据拼接到当前懒加载的节点上。

在 Table 组件上加入 `useLazyloadPlugin` 插件，第一个参数传入 `onLoad` 的方法，即可轻松开启懒加载。

```ts
const onLoadMore = async record => {
  await wait(1000);
  const res = await getData();
  return res;
};

return (
  <TreeTable
    rowKey="id"
    dataSource={data}
    columns={columns}
    scroll={{ x: true }}
    plugins={[
      useLazyloadPlugin({
        onLoad: onLoadMore,
        hasNextKey: 'has_next',
      }),
    ]}
  />
);
```

<code src="./Lazyload" />

完整的插件签名如下：

```ts
export interface UseLazyLoadPlugin {
  (config: Config): TreeTablePlugin;
}

interface Config {
  onLoad(record): any[] | Promise<any[]>;
  hasNextKey?: string;
}
```
