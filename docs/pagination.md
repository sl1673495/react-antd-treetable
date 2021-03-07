## 子节点分页

每层子节点都可以开启分页功能，使用 `usePaginationPlugin` 即可。

这个插件的签名如下：

```ts
export interface TreeTableChildrenPagination {
  // 需要在树节点上通过这个属性查找节点的下一级一共有多少数据
  totalKey: string | number;
  // 分页加载更多函数 返回的结果会被自动重置到节点上
  onChange: (current: number, record: any) => any[] | Promise<any[]>;
  pageSize?: number;
}

usePaginationPlugin(childrenPagination: TreeTableChildrenPagination)
```

<code src="./Pagination" />
