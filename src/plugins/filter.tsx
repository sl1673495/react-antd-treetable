import React from 'react';
import styled from 'styled-components';
import { Popover, Input, PopoverProps, TableColumnType } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { TreeTablePlugin } from '../types';
import { createInternalConstant } from '../utils';

const INTERNAL_SEARCH_KEY = createInternalConstant('search_value');

interface UseFilterPlugin<RecordType = any> {
  (
    onFetch: OnFetch<RecordType>,
    options?: {
      /** 展示过滤的列的 dataIndex */
      filterDataIndex?: string;
      /** 覆盖 popover 的默认 props */
      popover?: PopoverProps;
      /** 过滤输入框的 placeholder */
      placeholder?: string;
      /** 根据行信息决定是否开启过滤 */
      enable?(record: RecordType): boolean;
      /** 有筛选值时图标的颜色 */
      highlightIconColor?: string;
    },
  ): TreeTablePlugin;
}
interface OnFetch<RecordType = any> {
  (record: RecordType, value: string): any;
}

const StyledFilterHead = styled.div`
  display: flex;
  align-items: center;

  .content {
    display: flex;
    margin-right: 8px;
  }
`;

const StyledFilterOutlined = styled(FilterOutlined)<{
  $filtered: boolean;
  $highlightIconColor: string;
}>`
  cursor: pointer;
  margin-left: 8px;
  color: ${props => (props.$filtered ? props.$highlightIconColor : undefined)};
`;

export const useFilterPlugin: UseFilterPlugin = (onFetch, options = {}) => {
  return (props, context) => {
    let {
      filterDataIndex = props.headDataIndex,
      popover,
      placeholder = '',
      highlightIconColor = '#40a9ff',
      enable,
    } = options;

    const { addImperativeHandle } = context;

    addImperativeHandle({
      getNodeSearchKey(record) {
        return record?.[INTERNAL_SEARCH_KEY];
      },
    });

    const onColumn = (column: TableColumnType<any>) => {
      const { dataIndex, render } = column;
      // 负责展示筛选按钮的父节点
      if (dataIndex === filterDataIndex) {
        column.render = (text, record, index) => {
          const onSearch = async event => {
            const { value } = event.target;
            record[INTERNAL_SEARCH_KEY] = value;
            context.setNodeLoading(record, true);
            const result = await onFetch(record, value);
            context.replaceChildList(record, result);
            context.setNodeLoading(record, false);
          };

          const {
            [props.childrenColumnName]: children,
            [props.rowKey]: key,
          } = record;
          const token = record[INTERNAL_SEARCH_KEY];
          const defaultShowFilter =
            token ||
            // @ts-ignore
            (context.expandedRowKeys?.includes(key) && children?.length);
          const showFilter = enable ? enable(record) : defaultShowFilter;

          return (
            <StyledFilterHead>
              {render?.(text, record, index) ?? text}
              {showFilter ? (
                <Popover
                  content={() => {
                    return (
                      <Input
                        defaultValue={token}
                        onBlur={onSearch}
                        onPressEnter={onSearch}
                        placeholder={placeholder}
                      />
                    );
                  }}
                  title="请搜索子节点"
                  trigger="click"
                  placement="bottom"
                  {...popover}
                >
                  <StyledFilterOutlined
                    $filtered={!!token}
                    $highlightIconColor={highlightIconColor}
                  />
                </Popover>
              ) : null}
            </StyledFilterHead>
          );
        };
      }
    };

    return {
      onColumn,
    };
  };
};
