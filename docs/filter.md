## 子节点过滤

使用 `useFilterPlugin` 可以开启子节点分页功能，

默认是在以下两个条件满足的情况下展示过滤图标：

1. 节点为展开状态
2. 节点 children 不为空

也可以使用 `enable` 属性来手动控制。

传入的 `onSearch` 函数会接收到 `record` 和搜索的值，前后端负责过滤逻辑皆可以，只需要函数返回过滤后的列表即可。

由于搜索结果可能为空，所以配合 `useEmptyPlugin` 使用效果更佳。

代码示例：

```ts
const DefaultExample = () => {
  const onSearch = async (record, value) => {
    const result = children?.filter(({ function_name }) =>
      function_name.includes(value),
    );
    return result;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>([
    rootKey,
  ]);

  return (
    <TreeTable
      rowKey="id"
      expandedRowKeys={expandedKeys}
      onExpandedRowsChange={setExpandedKeys}
      expandable={{
        defaultExpandAllRows: true,
      }}
      dataSource={data}
      columns={columns}
      plugins={[useFilterPlugin(onSearch), useEmptyPlugin('暂无结果')]}
    />
  );
};
```

<code src="./Filter" />

完整的插件签名：

```ts
interface UseFilterPlugin<RecordType = any> {
  (
    onFetch: OnFetch<RecordType>,
    options?: {
      /** 展示过滤的列的 dataIndex */
      filterDataIndex?: string;
      /** 覆盖 popover 的默认 props */
      popover?: PopoverProps;
      /** 过滤输入框的 placeholder */
      placeholder?: string;
      /** 根据行信息决定是否开启过滤 */
      enable?(record: RecordType): boolean;
      /** 有筛选值时图标的颜色 */
      highlightIconColor?: string;
    },
  ): TreeTablePlugin;
}
```
