import React, { useState } from 'react';
import TreeTable, { usePaginationPlugin, useLazyloadPlugin } from '../../src';

const columns = [
  {
    title: '函数名',
    dataIndex: 'function_name',
    width: 700,
  },
  {
    title: '上报次数',
    dataIndex: 'count',
    width: 120,
  },
];

const getData = () => {
  return [
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()} (带分页器)`,
      count: 100,
      has_next: true,
      next_size: 10,
    },
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
    },
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
    },
    {
      id: Math.random(),
      function_name: `sub_function_${Math.random()}`,
      count: 100,
      has_next: true,
    },
  ];
};

const rootKey = Math.random();
const data = [
  {
    id: rootKey,
    function_name: `React Tree Reconciliation`,
    count: 100,
    next_size: 10,
    children: getData(),
  },
];

const wait = time => new Promise(resolve => setTimeout(resolve, time));

const DefaultExample = () => {
  const onLoadMore = async record => {
    await wait(1000);
    const res = await getData();
    return res;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.ReactText[]>([
    rootKey,
  ]);
  return (
    <TreeTable
      rowKey="id"
      expandedRowKeys={expandedKeys}
      onExpandedRowsChange={setExpandedKeys}
      dataSource={data}
      columns={columns}
      plugins={[
        useLazyloadPlugin({
          onLoad: onLoadMore,
          hasNextKey: 'has_next',
        }),
        usePaginationPlugin({
          totalKey: 'next_size',
          pageSize: 4,
          onChange: onLoadMore,
        }),
      ]}
    />
  );
};

export default DefaultExample;
