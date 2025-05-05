import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { FooterProps } from '../types';
import { formatDate } from '../utils/filterUtils';

const { Text } = Typography;

/**
 * 页脚组件
 * 显示脚本总数和最后更新时间
 */
const Footer: React.FC<FooterProps> = ({ total, lastUpdated }) => {
  const { t } = useTranslation();
  
  return (
    <div className="footer">
      <Text type="secondary">
        {t('scriptMarket.footer.total') || "脚本总数"}: {total} | 
        {t('scriptMarket.footer.lastUpdated') || "最后更新"}: {formatDate(lastUpdated, 'full')}
      </Text>
      <div style={{ marginTop: 8 }}>
        <Text type="secondary">
          &copy; {new Date().getFullYear()} {t('scriptMarket.footer.copyright') || "脚本市场"}
        </Text>
      </div>
    </div>
  );
};

export default Footer;