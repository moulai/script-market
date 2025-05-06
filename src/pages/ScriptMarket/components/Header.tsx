import React from 'react';
import { Typography, Radio, Space, Button, Tooltip } from 'antd';
import { GlobalOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { HeaderProps } from '../types';
import './styles.css'; // 引入样式文件

const { Title } = Typography;

/**
 * 页面头部组件
 * 显示页面标题和语言切换
 */
const Header: React.FC<HeaderProps> = ({ onLanguageChange, onRefresh }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // 处理语言切换
  const handleLanguageChange = (e: any) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };
  
  // 处理刷新按钮点击
  const handleRefresh = () => {
    // 清除缓存并重新加载页面
    if (onRefresh) {
      onRefresh();
    } else {
      // 如果没有提供onRefresh函数，则使用默认行为
      window.location.reload();
    }
  };
  
  const headerStyle = {
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fff'
  };
  
  const headerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 24px',
    padding: '0 16px'
  };
  
  const titleStyle = {
    margin: 0
  };
  
  const languageSwitcherStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div className="script-market-header" style={headerStyle}>
      <div className="header-content" style={headerContentStyle}>
        <Title level={2} className="header-title" style={titleStyle}>
          {t('scriptMarket.title') || '脚本市场'}
        </Title>
        
        <Space className="language-switcher" style={languageSwitcherStyle}>
          <Tooltip title={t('scriptMarket.refresh') || "清除缓存并刷新"}>
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleRefresh}
              style={{ marginRight: '12px' }}
            />
          </Tooltip>
          <GlobalOutlined />
          <Radio.Group
            value={currentLanguage}
            onChange={handleLanguageChange}
            optionType="button"
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">English</Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      
      {/* 使用内联样式替代styled-jsx */}
    </div>
  );
};

export default Header;