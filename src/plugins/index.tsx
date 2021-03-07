import { TableColumnType, TableProps } from 'antd';
import { ResolvedProps, TreeTablePluginContext } from '../types';

export const usePluginContainer = (
  props: ResolvedProps,
  context: TreeTablePluginContext,
) => {
  const { plugins: rawPlugins } = props;

  const plugins = rawPlugins
    .map(usePlugin => usePlugin?.(props, context))
    .filter(Boolean);

  const container = {
    onColumn(column: TableColumnType<any>) {
      for (const plugin of plugins) {
        plugin?.onColumn?.(column);
      }
    },
    onRecord(record, parentRecord, level) {
      for (const plugin of plugins) {
        plugin?.onRecord?.(record, parentRecord, level);
      }
    },
    onExpand(expanded, record) {
      for (const plugin of plugins) {
        plugin?.onExpand?.(expanded, record);
      }
    },
    /**
     * 暂时只做 components 的 deepmerge
     * 不处理自定义组件的冲突 后定义的 Cell 会覆盖前者
     */
    mergeComponents() {
      let components: TableProps<any>['components'] = props.components || {};
      const merge = (componentsA, componentsB) => {
        const deepKeys = ['header', 'body'];
        const merged: TableProps<any>['components'] = {};
        deepKeys.forEach(key => {
          if (componentsA[key] || componentsB[key]) {
            merged[key] = Object.assign({}, componentsA[key], componentsB[key]);
          }
        });
        merged['table'] = componentsA.table || componentsB.table;
        return merged;
      };
      for (const plugin of plugins) {
        components = merge(components, plugin?.components || {});
      }
      return components;
    },
  };

  return container;
};

export { usePaginationPlugin } from './pagination';

export { useLazyloadPlugin } from './lazyload';

export { useIndentLinePlugin } from './indent-line';

export { useFilterPlugin } from './filter';

export { useEmptyPlugin } from './empty';
