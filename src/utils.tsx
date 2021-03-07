/**
 * 递归树的通用函数
 */
export const traverseTree = (
  treeList: any[],
  childrenColumnName: string,
  callback,
) => {
  const traverse = (list, parent = null, level = 1) => {
    list.forEach(treeNode => {
      callback(treeNode, parent, level);
      const { [childrenColumnName]: next } = treeNode;
      if (Array.isArray(next)) {
        traverse(next, treeNode, level + 1);
      }
    });
  };
  traverse(treeList);
};

export const resolveAllExpandableKeys = (
  dataSource,
  { childrenColumnName = 'children', rowKey = 'id' } = {},
) => {
  const keys: any[] = [];
  traverseTree(dataSource, childrenColumnName, node => {
    if (
      node[childrenColumnName] &&
      // 去除掉内部用的占位节点
      !isInternalNode(node[childrenColumnName]?.[0], rowKey)
    ) {
      keys.push(node[rowKey]);
    }
  });
  return keys;
};

export const INTERNAL_PREFIX = '__react_antd_treetable';

export const createInternalConstant = (value: string) =>
  `${INTERNAL_PREFIX}_${value}`;

export const isInternalNode = (record, rowKey) => {
  return record[rowKey]?.startsWith?.(INTERNAL_PREFIX);
};
