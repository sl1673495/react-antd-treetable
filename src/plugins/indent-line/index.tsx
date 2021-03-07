import React from 'react';
import {
  ResolvedProps,
  TreeTablePluginContext,
  TreeTablePlugin,
} from '../../types';
import { IndentCell } from './IndentCell';

export const useIndentLinePlugin: TreeTablePlugin = (
  props: ResolvedProps,
  context: TreeTablePluginContext,
) => {
  const { expandedRowKeys } = context;
  const onColumn = column => {
    column.onCell = record => {
      return {
        record,
        ...column,
      };
    };
  };

  const components = {
    body: {
      cell: cellProps => (
        <IndentCell
          {...props}
          {...cellProps}
          expandedRowKeys={expandedRowKeys}
        />
      ),
    },
  };

  return {
    components,
    onColumn,
  };
};
