import React, { useMemo } from 'react';
import { INTERNAL_LEVEL, INTERNAL_PARENT } from '../../constant';

export const IndentCell = props => {
  const {
    headDataIndex,
    children,
    record,
    dataIndex,
    rowKey,
    expandedRowKeys,
    indentSize,
    className,
  } = props;

  const isParentExpanded = expandedRowKeys.includes(
    record?.[INTERNAL_PARENT]?.[rowKey],
  );

  if (dataIndex !== headDataIndex || !isParentExpanded) {
    return (
      <td className={className}>
        <div className="react-antd-treetable-cell-content">{children}</div>
      </td>
    );
  }

  // 只有当前是展示指引线的列 且父节点是展开节点 才会展示缩进指引线
  // 只要知道层级 就知道要在 td 中绘制几条垂直指引线 举例来说：
  // 第 2 层： | | text
  // 第 3 层： | | | text
  const level = record[INTERNAL_LEVEL];
  // eslint-disable-next-line
  const indent = useMemo(() => {
    const indents: number[] = [];
    for (let index = 1; index < level; index++) {
      indents.push(index * indentSize);
    }
    return indents.map(indent => (
      <div
        style={{
          position: 'absolute',
          left: indent,
          top: 0,
          bottom: 0,
          width: 1,
          height: '100%',
          backgroundColor: '#e8e8e8',
        }}
        key={indent}
      />
    ));
    // eslint-disable-next-line
  }, [level]);

  return (
    <td className={`${className} react-antd-treetable-cell`}>
      {indent}
      <div className="react-antd-treetable-cell-content">{children}</div>
    </td>
  );
};
