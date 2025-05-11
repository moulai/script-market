import React, { useState, useEffect } from 'react';
import { Modal, Typography, Tag, Button, Space, Divider, message, Spin, Descriptions, Tooltip } from 'antd';
import { DownloadOutlined, CopyOutlined, CloseOutlined, IdcardOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { ScriptDetailModalProps } from '../types';
import { IScript } from '../../../types/script';
import { copyToClipboard } from '../utils/downloadUtils'; // downloadScript is now in scriptActionHandler
import { formatDate } from '../utils/filterUtils';
import { getTagColor } from '../../../utils/tagUtils';
import githubConfig from '../../../config/githubConfig';
import { handleScriptAction, getActionButtonLabel } from '../utils/scriptActionHandler';

const { Title, Text } = Typography;

/**
 * 脚本详情模态框组件
 * 显示脚本的详细信息和提供下载、复制功能
 */
const ScriptDetailModal: React.FC<ScriptDetailModalProps> = ({
  visible,
  scriptId,
  onClose
}) => {
  const { t } = useTranslation();
  const [scriptDetail, setScriptDetail] = useState<IScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 获取脚本详情
  useEffect(() => {
    const fetchDetail = async () => {
      if (!visible || !scriptId) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.BASE_URL}script_dist/${scriptId}.json`);
        
        if (!response.ok) {
          throw new Error(`获取脚本详情失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setScriptDetail(data);
      } catch (err) {
        console.error('获取脚本详情出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [visible, scriptId]);
  
  // 打开脚本历史版本页面
  const openVersionHistory = () => {
    if (!scriptDetail) return;
    
    const { owner, repo, branch } = githubConfig;
    const historyUrl = `https://github.com/${owner}/${repo}/commits/${branch}/public/script_dist/${scriptDetail.id}.json`;
    
    window.open(historyUrl, '_blank');
  };

  // 处理主操作（下载或导入）
  const handlePrimaryAction = () => {
    if (!scriptDetail) return;
    const urlParams = new URLSearchParams(window.location.search);
    handleScriptAction(scriptDetail, urlParams, t);
  };
  
  // 处理复制脚本内容
  const handleCopy = async () => {
    if (!scriptDetail) return;
    
    const success = await copyToClipboard(scriptDetail.content);
    
    if (success) {
      message.success(t('scriptMarket.detail.copySuccess') || '复制成功');
    } else {
      message.error(t('scriptMarket.detail.copyFailed') || '复制失败');
    }
  };
  
  // 渲染模态框内容
  const renderModalContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" tip={t('common.loading') || "加载中..."} />
        </div>
      );
    }
    
    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="danger">{error}</Text>
        </div>
      );
    }
    
    if (!scriptDetail) {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="warning">{t('scriptMarket.detail.noData') || "没有找到脚本数据"}</Text>
        </div>
      );
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const primaryButtonLabel = getActionButtonLabel(urlParams, t);

    return (
      <>
        <div className="script-detail-header">
          <div style={{ marginBottom: 0 }}>
            <Tag color="default" style={{ fontSize: '12px' }}>
              <IdcardOutlined style={{ marginRight: 4 }} />
              {scriptDetail.id}
            </Tag>
          </div>
          <Title level={3} style={{ marginTop: 12}}>{scriptDetail.name}</Title>
          
          <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }} size="small">
            <Descriptions.Item label={t('scriptMarket.detail.author') || "作者"}>
              {scriptDetail.author}
            </Descriptions.Item>
            <Descriptions.Item label={t('scriptMarket.detail.version') || "版本"}>
              {scriptDetail.version}
              <Tooltip title={t('scriptMarket.detail.viewVersionHistory') || "查看历史版本"}>
                <Button 
                  type="link" 
                  icon={<HistoryOutlined />} 
                  size="small"
                  onClick={openVersionHistory}
                  style={{ marginLeft: 8, padding: '0 4px' }}
                >
                  {t('scriptMarket.detail.history') || "历史版本"}
                </Button>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label={t('scriptMarket.detail.createdAt') || "创建时间"}>
              {formatDate(scriptDetail.createdAt, 'full')}
            </Descriptions.Item>
            <Descriptions.Item label={t('scriptMarket.detail.updatedAt') || "更新时间"}>
              {formatDate(scriptDetail.updatedAt, 'full')}
            </Descriptions.Item>
          </Descriptions>
          
          <div style={{ marginTop: 16 }}>
            <Space size={[0, 8]} wrap>
              {scriptDetail.tags.map(tag => (
                <Tag key={tag} color={getTagColor(tag)}>
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
          
          {scriptDetail.info && (
            <div style={{ marginTop: 16 }}>
              <ReactMarkdown>{scriptDetail.info}</ReactMarkdown>
            </div>
          )}
        </div>
        
        <Divider>{t('scriptMarket.detail.content') || "脚本内容"}</Divider>
        
        <div className="script-detail-content">
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 16, 
            borderRadius: 4,
            overflow: 'auto',
            maxHeight: '300px',
            fontFamily: 'monospace'
          }}>
            {scriptDetail.content}
          </pre>
        </div>
        
        {scriptDetail.buttons && scriptDetail.buttons.length > 0 && (
          <>
            <Divider>{t('scriptMarket.detail.buttons') || "按钮配置"}</Divider>
            <div className="script-detail-buttons">
              <Space direction="vertical" style={{ width: '100%' }}>
                {scriptDetail.buttons.map((button, index) => (
                  <div key={index} style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text strong>{button.name}</Text>
                    <Tag color={button.visible ? 'green' : 'red'}>
                      {button.visible 
                        ? (t('scriptMarket.detail.visible') || "可见") 
                        : (t('scriptMarket.detail.invisible') || "隐藏")}
                    </Tag>
                  </div>
                ))}
              </Space>
            </div>
          </>
        )}
        
        <div className="script-detail-actions" style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />} // 图标可能也需要根据操作类型动态改变，暂时保留DownloadOutlined
              onClick={handlePrimaryAction}
              style={{ color: '#fff' }}
            >
              {primaryButtonLabel}
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopy}
            >
              {t('scriptMarket.detail.copy') || "复制内容"}
            </Button>
          </Space>
        </div>
      </>
    );
  };
  
  return (
    <Modal
      title={t('scriptMarket.detail.title') || "脚本详情"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="script-detail-modal"
      closeIcon={<CloseOutlined />}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default ScriptDetailModal;