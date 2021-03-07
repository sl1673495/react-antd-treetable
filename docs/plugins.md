## 插件机制

react-antd-treetable 的所有拓展功能都基于插件机制实现，具体原理感兴趣可见这篇文章：

[如何编写神奇的「插件机制」，优化基于 Antd Table 封装表格的混乱代码](https://github.com/sl1673495/blogs/issues/78)

所谓的插件其实就是一个函数，返回一个标准格式的对象，把「处理每个节点、column、每次 onExpand」 的时机暴露出去。

这样让用户也可以介入这些流程，去改写一些属性，调用一些内部方法，以此实现上面的几个功能。

插件的签名如下：

```ts
export interface TreeTablePlugin<RecordType = any> {
  (props: ResolvedProps, context: TreeTablePluginContext<RecordType>): {
    /**
     * 可以访问到每一个 column 并修改
     */
    onColumn?(column: TableColumnType<RecordType>): void;
    /**
     * 可以访问到每一个节点数据
     * 在初始化或者新增子节点以后都会执行
     */
    onRecord?(
      record: RecordType,
      parentRecord: RecordType,
      level: number,
    ): void;
    /**
     * 节点展开的回调函数
     */
    onExpand?(expanded: boolean, record: RecordType): void;
    /**
     * 自定义 Table 组件，目前开启缩进线的情况下不能改写 Cell
     */
    components?: TableProps<RecordType>['components'];
  };
}
```

接受的第一个参数是 TreeTable 组件接受到的 `props`。

第二个参数 `context` 是插件内部的一些工具函数：

```ts
export interface TreeTablePluginContext<RecordType = any> {
  /** 强制组件重渲染 */
  forceUpdate: React.DispatchWithoutAction;
  /** 替换树的某个节点的子树 会自动重新渲染 */
  replaceChildList(record: RecordType, childList: RecordType[]): void;
  expandedRowKeys: TableProps<RecordType>['expandedRowKeys'];
  setExpandedRowKeys: (v: string[] | number[] | undefined) => void;
  /** 内部使用 允许给组件的 ref 上添加一些对外暴露的属性 */
  addImperativeHandle(handlers: object): void;
  setNodeLoading(record: RecordType, isLoading: boolean): void;
  getNodeLoading(record: RecordType): boolean | undefined;
  getParentRecord(record: RecordType): any;
  getRecordLevel(record: RecordType): number | undefined;
  /**
   * 开启 useFilterPlugin 后的工具函数
   */
  getNodeSearchKey?(record: RecordType): string | undefined;
  /**
   * 开启 usePaginationPlugin 后的工具函数
   */
  setNodePage?(record: RecordType, number: number): void;
  getNodePage?(record: RecordType): number | undefined;
}
```

如果你想编写自己的插件，可以参考源码中的 plugins 目录，以一个简单的 `useEmptyPlugin` 插件为例，它的逻辑就是在子节点为空数组的时候展示外部传入的空提示节点：

```ts
import React from 'react';
import { TableColumnType } from 'antd';
import { TreeTablePlugin } from '../types';
import { createInternalConstant } from '../utils';

// 内部占位节点的 key 需要使用这个方法来创建
const INTERNAL_EMPTY_KEY = createInternalConstant('empty');

interface UseEmptyPlugin {
  (
    EmptyNode?: React.ReactNode,
    options?: { emptyNodeIndex?: string },
  ): TreeTablePlugin;
}

const isInternalEmptyNode = (record, rowKey: string) => {
  return record?.[rowKey]?.startsWith?.(INTERNAL_EMPTY_KEY);
};

const generateInternalEmptyNode = (rowKey: string) => {
  return { [rowKey]: `${INTERNAL_EMPTY_KEY}_${Math.random()}` };
};

export const useEmptyPlugin: UseEmptyPlugin = (EmptyNode, options = {}) => {
  return props => {
    let { emptyNodeIndex = props.headDataIndex } = options;
    const { childrenColumnName, rowKey } = props;

    const onRecord = record => {
      const children = record[childrenColumnName];
      if (Array.isArray(children) && children.length === 0) {
        // 内部占位节点
        children.push(generateInternalEmptyNode(rowKey));
      }
    };

    const onColumn = (column: TableColumnType<any>) => {
      const { dataIndex, render } = column;
      // 负责展示筛选按钮的父节点
      column.render = (text, record, index) => {
        // 判断为占位节点
        if (isInternalEmptyNode(record, rowKey)) {
          if (dataIndex === emptyNodeIndex) {
            return EmptyNode;
          } else {
            // 除了展示空节点的列以外 其他不渲染任何内容
            return null;
          }
        }
        // 不是占位节点 按照原来的逻辑渲染
        return render?.(text, record, index) ?? text;
      };
    };

    return {
      onRecord,
      onColumn,
    };
  };
};
```
