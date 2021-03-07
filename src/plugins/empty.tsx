import React from 'react';
import { TableColumnType } from 'antd';
import { TreeTablePlugin } from '../types';
import { createInternalConstant } from '../utils';

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
        children.push(generateInternalEmptyNode(rowKey));
      }
    };

    const onColumn = (column: TableColumnType<any>) => {
      const { dataIndex, render } = column;
      // 负责展示筛选按钮的父节点
      column.render = (text, record, index) => {
        if (isInternalEmptyNode(record, rowKey)) {
          if (dataIndex === emptyNodeIndex) {
            return EmptyNode;
          } else {
            return null;
          }
        }
        return render?.(text, record, index) ?? text;
      };
    };

    return {
      onRecord,
      onColumn,
    };
  };
};
