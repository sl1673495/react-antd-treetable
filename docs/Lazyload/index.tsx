import React from 'react';
import TreeTable, { useLazyloadPlugin } from '../../src';
import 'antd/dist/antd.css';

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

const getData = async () => {
  return [
    {
      id: `${Math.random()}`,
      function_name: `sub_function_${`${Math.random()}`}`,
      count: 100,
      has_next: true,
    },
  ];
};

const data = [
  {
    id: `${Math.random()}`,
    function_name: `点这里加载更多……`,
    count: 100,
    has_next: true,
  },
];

const wait = time => new Promise(resolve => setTimeout(resolve, time));

const DefaultExample = () => {
  const onLoadMore = async record => {
    await wait(1000);
    const res = await getData();
    return res;
  };

  return (
    <TreeTable
      rowKey="id"
      dataSource={data}
      columns={columns}
      scroll={{ x: true }}
      plugins={[
        useLazyloadPlugin({
          onLoad: onLoadMore,
          hasNextKey: 'has_next',
        }),
      ]}
    />
  );
};

export default DefaultExample;
