import { TableProps, TableColumnType } from 'antd';
import { resolveProps } from './TreeTable';

export interface TreeTableProps<T = any> extends TableProps<T> {
  rowKey: string;
  dataSource: T[];
  columns: TableColumnType<T>[];
  // 子树的属性名 默认是 children
  childrenColumnName?: string;
  // 禁用缩进线
  disableIndentLine?: boolean;
  // 展示缩进线的列的 dataIndex 默认是第一列
  headDataIndex?: string;
  plugins?: TreeTablePlugin<T>[];
}

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

export interface TreeTablePluginContext<RecordType = any>
  extends TreeTableRef<RecordType> {
  /** 强制组件重渲染 */
  forceUpdate: React.DispatchWithoutAction;
  expandedRowKeys: TableProps<RecordType>['expandedRowKeys'];
  setExpandedRowKeys: (v: string[] | number[] | undefined) => void;
  /** 内部使用 允许给组件的 ref 上添加一些对外暴露的属性 */
  addImperativeHandle(handlers: object): void;
}

export interface TreeTableRef<RecordType = any> {
  /** 替换树的某个节点的子树 会自动重新渲染 */
  replaceChildList(record: RecordType, childList: RecordType[]): void;
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

export type ResolvedProps = ReturnType<typeof resolveProps>;
