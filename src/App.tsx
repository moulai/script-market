import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';

import theme from './theme';
import UploadPage from './pages/Upload';
import ResultPage from './pages/Result';
import ScriptMarket from './pages/ScriptMarket';
import './locales/i18n';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  
  // 根据当前语言选择Ant Design的语言包
  const antdLocale = i18n.language === 'zh' ? zhCN : enUS;
  
  return (
    <ConfigProvider theme={theme} locale={antdLocale}>
      <Router>
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/" element={<ScriptMarket />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 