import React from 'react';
import { Pagination } from 'antd';
import {
  ResolvedProps,
  TreeTablePluginContext,
  TreeTablePlugin,
} from '../types';
import {
  INTERNAL_PARENT,
  INTERNAL_IS_LOADING,
  INTERNAL_PAGINATION_KEY,
} from '../constant';
import { createInternalConstant } from '../utils';

export const INTERNAL_PAGINATION_CURRENT = createInternalConstant(
  'pagination_current',
);

export const isInternalPaginationNode = (record, rowKey) => {
  return record?.[rowKey]?.startsWith?.(INTERNAL_PAGINATION_KEY);
};

export const generateInternalPaginationNode = (rowKey: string) => ({
  [rowKey]: `${INTERNAL_PAGINATION_KEY}-${Math.random()}`,
});

export interface TreeTablePaginationOptions {
  // 需要在树节点上通过这个属性查找节点的下一级一共有多少数据
  totalKey: string | number;
  // 分页加载更多函数 返回的结果会被自动重置到节点上
  onChange: (current: number, record: any) => any[] | Promise<any[]>;
  pageSize?: number;
}

interface UsePaginationPlugin {
  (paginationOptions: TreeTablePaginationOptions): TreeTablePlugin;
}

export const usePaginationPlugin: UsePaginationPlugin = paginationOptions => (
  props: ResolvedProps,
  context: TreeTablePluginContext,
) => {
  const { forceUpdate, replaceChildList, addImperativeHandle } = context;
  const { childrenColumnName, rowKey, headDataIndex } = props;

  addImperativeHandle({
    setNodePage(record, page) {
      record[INTERNAL_PAGINATION_CURRENT] = page;
    },
    getNodePage(record) {
      return record[INTERNAL_PAGINATION_CURRENT];
    },
  });

  const handlePagination = node => {
    if (!node) {
      return;
    }
    const { totalKey } = paginationOptions;
    const nodeChildren = node[childrenColumnName] || [];
    const [lastChildNode] = nodeChildren.slice?.(-1);
    // 渲染分页器，先加入占位节点
    if (
      node[totalKey] > nodeChildren?.length &&
      // 防止重复添加分页器占位符
      !isInternalPaginationNode(lastChildNode, rowKey)
    ) {
      nodeChildren?.push?.(generateInternalPaginationNode(rowKey));
    }
  };

  const rewritePaginationRender = column => {
    const { render, dataIndex } = column;
    const { totalKey, pageSize, onChange } = paginationOptions;
    column.render = function ColumnRender(text, record) {
      // 分页相关信息需要从父节点身上拿
      const parentRecord = record[INTERNAL_PARENT];

      const total = parentRecord?.[totalKey];
      if (isInternalPaginationNode(record, rowKey)) {
        if (dataIndex === headDataIndex) {
          const onPageChange = async current => {
            // 比较 hack 的记录页码在父节点上
            // 这样组件销毁重建以后 还能正确的展示页码
            parentRecord[INTERNAL_PAGINATION_CURRENT] = current;
            parentRecord[INTERNAL_IS_LOADING] = true;
            forceUpdate();
            const childList = await onChange(current, parentRecord);
            replaceChildList(parentRecord, childList);
          };

          return (
            <Pagination
              size="small"
              defaultCurrent={parentRecord[INTERNAL_PAGINATION_CURRENT]}
              total={total}
              pageSize={pageSize}
              onChange={onPageChange}
            />
          );
        } else {
          return null;
        }
      }
      return render?.(text, record) ?? text;
    };
  };

  return {
    onRecord: handlePagination,
    onColumn: rewritePaginationRender,
  };
};
