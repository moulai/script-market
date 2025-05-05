import React from 'react';
import { Button, Tag, Space, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { ScriptRowProps, ScriptRowData } from '../types';
import { formatDate } from '../utils/filterUtils';

/**
 * 脚本表格行组件
 * 用于表格视图中显示单个脚本的行数据
 * 注意：这不是一个标准的React组件，而是返回表格行数据的函数
 */
const ScriptRow = ({ script, onSelect, t }: ScriptRowProps & { t: (key: string) => string }): ScriptRowData => {
  
  // 处理查看详情
  const handleViewDetails = () => {
    onSelect(script.id);
  };
  
  // 处理下载脚本
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发行点击事件
    
    // 构造下载URL
    const downloadUrl = `/script_dist/${script.id}.json`;
    
    // 创建一个a标签并模拟点击
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${script.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 渲染标签列表
  const renderTags = () => {
    // 如果标签太多，只显示前3个
    const displayTags = script.tags.slice(0, 3);
    const hasMore = script.tags.length > 3;
    
    return (
      <Space size={[0, 4]} wrap>
        {displayTags.map(tag => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        ))}
        {hasMore && (
          <Tooltip 
            title={
              <div>
                {script.tags.slice(3).map(tag => (
                  <Tag key={tag} color="blue" style={{ margin: '2px' }}>
                    {tag}
                  </Tag>
                ))}
              </div>
            }
          >
            <Tag color="default">+{script.tags.length - 3}</Tag>
          </Tooltip>
        )}
      </Space>
    );
  };
  
  return {
    key: script.id,
    name: (
      <div style={{ fontWeight: 500 }}>{script.name}</div>
    ),
    author: script.author,
    tags: renderTags(),
    version: script.version,
    updatedAt: (
      <Tooltip title={new Date(script.updatedAt).toLocaleString('zh-CN')}>
        {formatDate(script.updatedAt, 'relative')}
      </Tooltip>
    ),
    action: (
      <Space>
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={handleViewDetails}
          style={{ color: '#fff' }}
        >
          {t('scriptMarket.table.viewDetails') || "查看详情"}
        </Button>
        <Button
          type="default"
          size="small"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          title={t('scriptMarket.table.download') || "下载脚本"}
        />
      </Space>
    )
  };
};

export default ScriptRow;