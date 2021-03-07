import React, { useState } from 'react';
import TreeTable, { useEmptyPlugin, useFilterPlugin } from '../../src';

const columns = [
  {
    title: '函数名',
    dataIndex: 'function_name',
    width: 400,
  },
  {
    title: '上报次数',
    dataIndex: 'count',
    width: 120,
  },
];

const rootKey = Math.random();
const children = [
  {
    id: Math.random(),
    function_name: `Tom Jerry`,
    count: 100,
  },
  {
    id: Math.random(),
    function_name: `王小虎`,
    count: 100,
  },
  {
    id: Math.random(),
    function_name: `西湖区`,
    count: 100,
  },
];
const data = [
  {
    id: rootKey,
    function_name: `React Tree Reconciliation`,
    count: 100,
    children,
  },
];

const DefaultExample = () => {
  const onSearch = async (record, value) => {
    const result = children?.filter(({ function_name }) =>
      function_name.includes(value),
    );
    return result;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>([
    rootKey,
  ]);

  return (
    <TreeTable
      rowKey="id"
      expandedRowKeys={expandedKeys}
      onExpandedRowsChange={setExpandedKeys}
      expandable={{
        defaultExpandAllRows: true,
      }}
      dataSource={data}
      columns={columns}
      plugins={[useFilterPlugin(onSearch), useEmptyPlugin('暂无结果')]}
    />
  );
};

export default DefaultExample;
