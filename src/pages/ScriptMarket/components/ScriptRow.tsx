import React, { useState } from 'react';
import { Button, Tag, Space, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import { ScriptRowProps, ScriptRowData } from '../types';
import { IScript } from '../../../types/script';
import { formatDate } from '../utils/filterUtils';
import { getTagColor } from '../../../utils/tagUtils';
import { handleScriptAction, getActionButtonLabel } from '../utils/scriptActionHandler';

/**
 * 脚本表格行组件
 * 用于表格视图中显示单个脚本的行数据
 * 注意：这不是一个标准的React组件，而是返回表格行数据的函数
 */
const ScriptRow = ({ script, onSelect, t }: ScriptRowProps & { t: TFunction }): ScriptRowData => {
  const [loading, setLoading] = useState(false);

  // 处理详情
  const handleViewDetails = () => {
    onSelect(script.id);
  };

  // 处理下载脚本
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发行点击事件
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}script_dist/${script.id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch script: ${response.statusText}`);
      }
      const fullScript: IScript = await response.json();
      const urlParams = new URLSearchParams(window.location.search);
      await handleScriptAction(fullScript, urlParams, t);
    } catch (error) {
      console.error("Error handling script action:", error);
      // 在这里可以添加错误处理逻辑，例如显示一个通知
    } finally {
      setLoading(false);
    }
  };

  // 渲染标签列表
  const renderTags = () => {
    // 如果标签太多，只显示前3个
    const displayTags = script.tags.slice(0, 3);
    const hasMore = script.tags.length > 3;
    
    return (
      <Space size={[0, 4]} wrap>
        {displayTags.map(tag => (
          <Tag key={tag} color={getTagColor(tag)}>
            {tag}
          </Tag>
        ))}
        {hasMore && (
          <Tooltip
            title={
              <div>
                {script.tags.slice(3).map(tag => (
                  <Tag key={tag} color={getTagColor(tag)} style={{ margin: '2px' }}>
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
      <Tooltip title={new Date(script.updatedAt).toLocaleString(t('i18n.locale') || 'zh-CN')}>
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
          {t('scriptMarket.table.viewDetails') || "详情"}
        </Button>
        <Button
          type="default"
          size="small"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={loading}
        >
          {getActionButtonLabel(new URLSearchParams(window.location.search), t)}
        </Button>
      </Space>
    )
  };
};

export default ScriptRow;