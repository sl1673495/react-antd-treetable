import { TableColumnType, TableProps } from 'antd';
import { ResolvedProps, TreeTablePluginContext } from '../types';

type Components = TableProps<any>['components'];

export const usePluginContainer = <RecordType extends object = any>(
  props: ResolvedProps,
  context: TreeTablePluginContext,
) => {
  const { plugins: rawPlugins } = props;

  const plugins = rawPlugins
    .map(usePlugin => usePlugin?.(props, context))
    .filter(Boolean);

  const container = {
    onColumn(column: TableColumnType<RecordType>) {
      for (const plugin of plugins) {
        plugin?.onColumn?.(column);
      }
    },
    onRecord(record: RecordType, parentRecord: RecordType, level: number) {
      for (const plugin of plugins) {
        plugin?.onRecord?.(record, parentRecord, level);
      }
    },
    onExpand(expanded: boolean, record: RecordType) {
      for (const plugin of plugins) {
        plugin?.onExpand?.(expanded, record);
      }
    },
    /**
     * 暂时只做 components 的 deepmerge
     * 不处理自定义组件的冲突 后定义的 Cell 会覆盖前者
     */
    mergeComponents() {
      const deepMerge = (...componentsArray: Components[]) => {
        const mergeResult = {};
        componentsArray = componentsArray.filter(Boolean);
        componentsArray.forEach(components => {
          const componentsKeys = Object.keys(components);
          for (let componentKey of componentsKeys) {
            const value = components[componentKey];
            if (typeof value === 'function') {
              // cell: Function
              mergeResult[componentKey] = value;
            } else if (typeof value === 'object') {
              // body: { row: Function }
              mergeResult[componentKey] = deepMerge(
                ...componentsArray.map(object => object[componentKey]),
              );
            }
          }
        });
        return mergeResult;
      };
      const allComponents = [
        props.components,
        ...plugins.map(plugin => plugin.components),
      ];
      return deepMerge(...allComponents);
    },
  };

  return container;
};

export { usePaginationPlugin } from './pagination';

export { useLazyloadPlugin } from './lazyload';

export { useIndentLinePlugin } from './indent-line';

export { useFilterPlugin } from './filter';

export { useEmptyPlugin } from './empty';
