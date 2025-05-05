import React from 'react';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { ScriptListProps } from '../types';
import TableView from './TableView';

/**
 * 脚本列表容器组件
 * 显示表格视图
 */
const ScriptList: React.FC<ScriptListProps> = ({
  scripts,
  loading,
  onScriptSelect
}) => {
  const { t } = useTranslation();
  
  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="script-list-loading" style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" tip={t('common.loading') || "加载中..."} />
      </div>
    );
  }
  
  return (
    <div className="script-list">
      <TableView scripts={scripts} onScriptSelect={onScriptSelect} />
    </div>
  );
};

export default ScriptList;