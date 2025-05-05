import React, { useState } from 'react';
import { Layout, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ScriptList from './components/ScriptList';
import ScriptDetailModal from './components/ScriptDetailModal';
import Footer from './components/Footer';
import { useScriptData } from './hooks/useScriptData';
import { useScriptFilter } from './hooks/useScriptFilter';
import './components/styles.css';

const { Content } = Layout;
const { Title } = Typography;

/**
 * 脚本市场主页面
 * 整合所有子组件，管理全局状态
 */
const ScriptMarket: React.FC = () => {
  const { t } = useTranslation();
  
  // 获取脚本数据
  const {
    scripts,
    loading,
    error,
    lastUpdated
  } = useScriptData();
  
  // 脚本筛选逻辑
  const {
    filteredScripts,
    tags,
    setSearchText,
    setSelectedTags,
    setSelectedAuthor
  } = useScriptFilter(scripts);
  
  // 脚本详情模态框状态
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // 处理脚本选择
  const handleScriptSelect = (scriptId: string) => {
    setSelectedScriptId(scriptId);
    setDetailModalVisible(true);
  };
  
  // 处理模态框关闭
  const handleModalClose = () => {
    setDetailModalVisible(false);
  };
  
  return (
    <Layout className="script-market-layout">
      <Header />
      <Content className="script-market-content">
        
        {error && (
          <Alert
            message={t('scriptMarket.error.title') || "加载错误"}
            description={error instanceof Error ? error.message : String(error)}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}
        
        <FilterBar
          onSearch={setSearchText}
          onTagsChange={setSelectedTags}
          onAuthorChange={setSelectedAuthor}
          tags={tags}
        />
        
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <ScriptList
            scripts={filteredScripts}
            loading={loading}
            onScriptSelect={handleScriptSelect}
          />
        </div>
        
        <Footer total={scripts.length} lastUpdated={lastUpdated} />
      </Content>
      
      <ScriptDetailModal
        visible={detailModalVisible}
        scriptId={selectedScriptId}
        onClose={handleModalClose}
      />
    </Layout>
  );
};

export default ScriptMarket;