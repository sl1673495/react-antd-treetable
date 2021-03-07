import React, {
  useEffect,
  useReducer,
  useImperativeHandle,
  useState,
} from 'react';
import { Table } from 'antd';
import { TreeTableExpandIcon } from './TreeTableExpandIcon';
import { usePluginContainer, useIndentLinePlugin } from './plugins';
import { traverseTree } from './utils';
import { TreeTableProps, TreeTableRef } from './types';
import {
  INTERNAL_LEVEL,
  INTERNAL_PARENT,
  INTERNAL_IS_LOADING,
} from './constant';
import './TreeTable.css';

export const TreeTable = React.forwardRef<TreeTableRef, TreeTableProps>(
  (rawProps, ref) => {
    const props = resolveProps(rawProps);
    const {
      columns,
      dataSource,
      rowKey,
      indentSize,
      childrenColumnName,
      onExpand: onExpandProp,
      ...restProps
    } = props;

    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState<
      string[]
    >([]);
    let expandedRowKeys;
    let setExpandedRowKeys;
    if ('expandedRowKeys' in props) {
      // ant-design v3
      expandedRowKeys = props.expandedRowKeys;
      setExpandedRowKeys = props.onExpandedRowsChange;
    } else if ('expandable' in props && props.expandable?.expandedRowKeys) {
      // ant-design v4
      expandedRowKeys = props.expandable.expandedRowKeys;
      setExpandedRowKeys = props.expandable.onExpandedRowsChange;
    } else {
      expandedRowKeys = internalExpandedRowKeys;
      setExpandedRowKeys = setInternalExpandedRowKeys;
    }

    const replaceChildList = (record, childList) => {
      record[childrenColumnName] = childList;
      record[INTERNAL_IS_LOADING] = false;
      rewriteTree({
        dataSource: childList,
        parentNode: record,
      });
    };

    const setNodeLoading = (record, isLoading) => {
      if (record) {
        record[INTERNAL_IS_LOADING] = isLoading;
        forceUpdate();
      }
    };
    const getNodeLoading = record => {
      return record?.[INTERNAL_IS_LOADING];
    };
    const getParentRecord = record => {
      return record?.[INTERNAL_PARENT];
    };
    const getRecordLevel = record => {
      return record?.[INTERNAL_LEVEL];
    };
    const nodeUtils = {
      setNodeLoading,
      getNodeLoading,
      getParentRecord,
      getRecordLevel,
    };

    let handlers = {};
    const addImperativeHandle = pluginHandlers => {
      handlers = Object.assign(handlers, pluginHandlers);
    };

    const pluginContext = {
      forceUpdate,
      replaceChildList,
      expandedRowKeys,
      setExpandedRowKeys,
      addImperativeHandle,
      ...nodeUtils,
    };
    const pluginContainer = usePluginContainer(props, pluginContext);

    useImperativeHandle(ref, () => ({
      replaceChildList,
      ...nodeUtils,
      ...handlers,
    }));

    const rewrittenColumns = columns.map(rawColumn => {
      const column = Object.assign({}, rawColumn);
      pluginContainer.onColumn(column);
      return column;
    });

    // hack: 解决 antd v4 一个奇怪的问题
    // 只有一个节点且异步加上 children 的时候 无法显示展开按钮
    // 所以处理完所有节点后 再开始渲染表格组件
    const [ready, setReady] = useState(false);
    useEffect(() => {
      rewriteTree({ dataSource });
      setReady(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource]);

    /**
     *  需要对 dataSource 进行一些改写 增加层级、父节点、loading 节点、分页等信息
     */
    function rewriteTree({
      dataSource = [] as any[],
      // 在动态追加子树节点的时候 需要手动传入 parent 引用
      parentNode = null,
    }) {
      // 在动态追加子树节点的时候 需要手动传入父节点的 level 否则 level 会从 1 开始计算
      const startLevel = parentNode?.[INTERNAL_LEVEL] || 0;

      if (parentNode) {
        pluginContainer.onRecord(parentNode, null, startLevel);
      }

      traverseTree(dataSource, childrenColumnName, (node, parent, level) => {
        parent = parent || parentNode || node[INTERNAL_PARENT];
        // 记录节点的层级
        node[INTERNAL_LEVEL] = level + startLevel;
        // 记录节点的父节点
        node[INTERNAL_PARENT] = parent;

        pluginContainer.onRecord(node, parent, level);
      });

      forceUpdate();
    }

    const onExpand = async (expanded, record) => {
      pluginContainer.onExpand(expanded, record);
      onExpandProp?.(expanded, record);
    };

    const components = pluginContainer.mergeComponents();

    const defaultTableProps = {
      pagination: false as const,
    };

    if (!ready) {
      return null;
    }

    return (
      <div className="react-antd-treetable">
        <Table
          {...defaultTableProps}
          {...restProps}
          childrenColumnName={childrenColumnName}
          bordered={false}
          indentSize={indentSize}
          columns={rewrittenColumns}
          components={components}
          rowKey={rowKey}
          dataSource={dataSource}
          onExpand={onExpand}
          expandIcon={expandIconProps => (
            <TreeTableExpandIcon
              {...expandIconProps}
              expandIcon={props.expandIcon}
            />
          )}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={setExpandedRowKeys}
        />
      </div>
    );
  },
);

export function resolveProps(props: TreeTableProps) {
  let {
    disableIndentLine,
    indentSize = 24,
    childrenColumnName = 'children',
    columns,
    headDataIndex,
    plugins: userPlugins = [],
  } = props;
  if (!headDataIndex) {
    headDataIndex = columns[0]?.dataIndex as string;
  }

  const plugins = [
    ...userPlugins,
    disableIndentLine ? null : useIndentLinePlugin,
  ];

  return {
    ...props,
    plugins,
    indentSize,
    headDataIndex,
    childrenColumnName,
  };
}
