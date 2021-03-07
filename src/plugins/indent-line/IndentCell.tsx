import React, { useMemo } from 'react';
import styled from 'styled-components';
import { INTERNAL_LEVEL, INTERNAL_PARENT } from '../../constant';

const StyledTd = styled.td`
  position: relative;
`;

// td 中的内容需要用 flex 容器包裹
// 否则换行时内容会和缩进线重叠在一起
const StyledContent = styled.div`
  display: flex;
`;

const IndentLine = styled.div<{ indent: number }>`
  position: absolute;
  left: ${props => props.indent}px;
  top: 0;
  bottom: 0;
  width: 1px;
  height: 100%;
  background-color: #e8e8e8;
`;

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
        <StyledContent>{children}</StyledContent>
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
    return indents.map(indent => <IndentLine indent={indent} key={indent} />);
    // eslint-disable-next-line
  }, [level]);

  return (
    <StyledTd className={className}>
      {indent}
      <StyledContent>{children}</StyledContent>
    </StyledTd>
  );
};
