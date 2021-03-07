import React from 'react';
import {
  LoadingOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { INTERNAL_IS_LOADING } from './constant';

const iconStyle = {
  marginRight: 8,
  marginTop: 4,
  fontSize: 12,
  flexShrink: 0,
};

export const TreeTableExpandIcon = ({
  expanded,
  expandable,
  onExpand,
  record,
}) => {
  if (record[INTERNAL_IS_LOADING]) {
    return <LoadingOutlined style={iconStyle} />;
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
