import React from 'react';
import TreeTable from '../../src';
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
    function_name: `React Tree Reconciliation`,
    count: 100,
    children: [
      {
        id: `${Math.random()}`,
        function_name: 'ErrorBoundary [mount] (#4)',
        count: 50,
        children: [
          {
            id: `${Math.random()}`,
            function_name: 'ErrorBoundary [mount] (#4)',
            count: 50,
          },
          {
            id: `${Math.random()}`,
            function_name: 'storyFn [mount]',
            count: 50,
          },
          {
            id: `${Math.random()}`,
            function_name: 'HashRouter [mount] (#10)',
            count: 50,
          },
        ],
      },
      {
        id: `${Math.random()}`,
        function_name: 'storyFn [mount]',
        count: 50,
      },
    ],
  },
];

const wait = time => new Promise(resolve => setTimeout(resolve, time));

const DefaultExample = () => {
  return (
    <TreeTable
      rowKey="id"
      dataSource={data}
      columns={columns}
      scroll={{ x: true }}
    />
  );
};

export default DefaultExample;
