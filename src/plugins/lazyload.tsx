import {
  ResolvedProps,
  TreeTablePluginContext,
  TreeTablePlugin,
} from '../types';
import { INTERNAL_IS_LOADING, INTERNAL_LOADING_KEY } from '../constant';

export const generateInternalLoadingNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_LOADING_KEY}-${Math.random()}`,
});

export interface UseLazyLoadPlugin {
  (config: Config): TreeTablePlugin;
}

interface Config {
  onLoad(record): any[] | Promise<any[]>;
  hasNextKey?: string;
}

export const useLazyloadPlugin: UseLazyLoadPlugin = ({
  onLoad,
  hasNextKey,
}) => (props: ResolvedProps, context: TreeTablePluginContext) => {
  const { childrenColumnName, rowKey } = props;
  const { replaceChildList, expandedRowKeys, setExpandedRowKeys } = context;
  const handleNextLevelLoader = node => {
    if (node?.[hasNextKey]) {
      // 树表格组件要求 next 必须是非空数组才会渲染「展开按钮」
      // 所以这里手动添加一个占位节点数组
      // 后续在 onExpand 的时候再加载更多节点 并且替换这个数组
      node[childrenColumnName] = [generateInternalLoadingNode(rowKey)];
    }
  };

  const onExpand = async (expanded: boolean, record) => {
    if (expanded && record[hasNextKey] && onLoad) {
      const originalHasNext = record[hasNextKey];
      const originalChildren = record[childrenColumnName];
      // 标识节点的 loading
      record[INTERNAL_IS_LOADING] = true;
      // 移除用来展示展开箭头的假 children
      record[childrenColumnName] = null;
      try {
        const childList = await onLoad(record);
        record[hasNextKey] = false;
        replaceChildList(record, childList);
      } catch (error) {
        // 加载数据错误的时候 恢复原本的节点状态
        record[hasNextKey] = originalHasNext;
        record[childrenColumnName] = originalChildren;
        setExpandedRowKeys(
          // @ts-ignore
          expandedRowKeys.filter((key: string) => key !== INTERNAL_LOADING_KEY),
        );
      }
    }
  };

  return {
    onRecord: handleNextLevelLoader,
    onExpand: onExpand,
  };
};
