import React, { useState } from 'react';
import { Table, Empty, Tooltip } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TableViewProps, ScriptRowData } from '../types';
import ScriptRow from './ScriptRow';
import type { SortOrder } from 'antd/es/table/interface';

/**
 * 表格视图组件
 * 以表格形式显示脚本列表
 */
const TableView: React.FC<TableViewProps> = ({ scripts, onScriptSelect }) => {
  const { t } = useTranslation();
  const [sortedInfo, setSortedInfo] = useState<any>({
    columnKey: 'updatedAt',
    order: 'descend'
  });
  
  // 处理表格排序变化
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };
  
  // 自定义排序图标
  const customSorterIcon = (props: { sortOrder: SortOrder }) => {
    const { sortOrder } = props;
    if (sortOrder === 'ascend') {
      return <SortAscendingOutlined />;
    }
    if (sortOrder === 'descend') {
      return <SortDescendingOutlined />;
    }
    return null;
  };
  
  // 表格列定义
  const columns = [
    {
      title: t('scriptMarket.table.name') || '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => {
        const aName = a.name.props.children;
        const bName = b.name.props.children;
        return aName.localeCompare(bName);
      },
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      sortDirections: ['ascend', 'descend', 'ascend'] as SortOrder[],
      showSorterTooltip: false,
      sortIcon: customSorterIcon,
      width: '20%',
    },
    {
      title: t('scriptMarket.table.author') || '作者',
      dataIndex: 'author',
      key: 'author',
      sorter: (a: any, b: any) => a.author.localeCompare(b.author),
      sortOrder: sortedInfo.columnKey === 'author' && sortedInfo.order,
      sortDirections: ['ascend', 'descend', 'ascend'] as SortOrder[],
      showSorterTooltip: false,
      sortIcon: customSorterIcon,
      width: '15%',
    },
    {
      title: t('scriptMarket.table.tags') || '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '20%',
    },
    {
      title: t('scriptMarket.table.version') || '版本',
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    },
    {
      title: t('scriptMarket.table.updatedAt') || '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: any, b: any) => {
        // 从Tooltip的title属性中提取日期字符串
        const aDate = a.updatedAt.props.title;
        const bDate = b.updatedAt.props.title;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      },
      sortOrder: sortedInfo.columnKey === 'updatedAt' && sortedInfo.order,
      sortDirections: ['ascend', 'descend', 'ascend'] as SortOrder[],
      showSorterTooltip: false,
      sortIcon: customSorterIcon,
      width: '15%',
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: t('scriptMarket.table.action') || '操作',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
    },
  ];
  
  // 生成表格数据
  const dataSource = scripts.map(script => ScriptRow({ script, onSelect: onScriptSelect, t }));
  
  // 表格本地化配置
  const locale = {
    emptyText: (
      <Empty
        description={t('scriptMarket.empty') || "没有找到匹配的脚本"}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  };
  
  return (
    <div className="table-view">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        locale={locale}
        onChange={handleChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `${t('scriptMarket.pagination.total') || "共"} ${total} ${t('scriptMarket.pagination.items') || "项"}`,
        }}
      />
    </div>
  );
};

export default TableView;