import React from 'react';
import { RenderExpandIconProps } from 'rc-table/lib/interface';
import { TableProps } from 'antd';
import {
  LoadingOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { INTERNAL_IS_LOADING } from './constant';

const iconStyle = {
  width: 12,
  height: 12,
  marginRight: 8,
  marginTop: 4,
  fontSize: 12,
  flexShrink: 0,
};

export const TreeTableExpandIcon = (
  props: RenderExpandIconProps<any> & {
    expandIcon: TableProps<any>['expandIcon'];
  },
): React.ReactElement => {
  const { expandIcon, ...expandIconProps } = props;
  const { expanded, expandable, onExpand, record } = expandIconProps;
  if (record[INTERNAL_IS_LOADING]) {
    return <LoadingOutlined style={iconStyle} />;
  }
  if (expandIcon) {
    return expandIcon(expandIconProps) as React.ReactElement;
  }
  if (expandable) {
    if (expanded) {
      return (
        <DownOutlined
          style={iconStyle}
          onClick={e => {
            onExpand(record, e);
          }}
        />
      );
    } else {
      return (
        <RightOutlined
          style={iconStyle}
          onClick={e => {
            onExpand(record, e);
          }}
        />
      );
    }
  } else {
    return <span style={iconStyle}></span>;
  }
};
