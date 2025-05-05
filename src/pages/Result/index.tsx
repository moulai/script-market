import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Typography, Space, Card, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ArrowLeftOutlined, 
  GithubOutlined,
  CopyOutlined,
  KeyOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Paragraph, Text, Link } = Typography;

// 结果页面参数接口
interface ResultState {
  success: boolean;
  message: string;
  url?: string;
  scriptName?: string;
  scriptId?: string;
  scriptPassword?: string;
}

const ResultPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 获取上传结果参数
  const state = location.state as ResultState;
  
  // 如果没有状态参数，跳转到上传页面
  if (!state) {
    navigate('/');
    return null;
  }
  
  // 返回上传页面
  const handleBackToUpload = () => {
    navigate('/');
  };

  // 复制文本到剪贴板
  const copyToClipboard = (text: string, successMsg: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success(successMsg);
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };
  
  return (
    <div className="container">
      <Card className="form-container">
        {/* 成功结果 */}
        {state.success ? (
          <Result
            status="success"
            title={t('result.success.title')}
            subTitle={state.message || t('result.success.content')}
            icon={<CheckCircleOutlined />}
            extra={[
              <Button 
                key="back" 
                onClick={handleBackToUpload}
                icon={<ArrowLeftOutlined />}
              >
                {t('common.back')}
              </Button>,
              state.url && (
                <Button 
                  key="view" 
                  type="primary"
                  icon={<GithubOutlined />}
                  href={state.url}
                  target="_blank"
                  style={{ color: '#fff' }}
                >
                  {t('result.script.view')}
                </Button>
              ),
            ]}
          >
            {state.url && (
              <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '6px' }}>
                <Paragraph>
                  <Text strong>{t('result.script.name')}:</Text> {state.scriptName}
                </Paragraph>
                <Paragraph>
                  <Text strong>{t('result.script.url')}:</Text> <Link href={state.url} target="_blank">{state.url}</Link>
                </Paragraph>
              </div>
            )}
            
            {state.scriptId && state.scriptPassword && (
              <div style={{ 
                background: '#fffbe6', 
                padding: '16px', 
                borderRadius: '6px', 
                marginTop: '16px',
                border: '1px solid #ffe58f'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="warning" strong style={{ fontSize: '16px' }}>
                    <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                    {t('result.credentials.title')}
                  </Text>
                </div>
                
                <Paragraph>
                  <Text type="secondary">
                    {t('result.credentials.description')}
                  </Text>
                </Paragraph>
                
                <div style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '4px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <Text strong style={{ marginRight: '8px' }}>{t('result.credentials.id')}:</Text>
                    <Text code>{state.scriptId}</Text>
                  </div>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(state.scriptId || '', t('result.credentials.idCopied'))}
                  >
                    {t('result.credentials.copy')}
                  </Button>
                </div>
                
                <div style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <Text strong style={{ marginRight: '8px' }}>{t('result.credentials.password')}:</Text>
                    <Text code>{state.scriptPassword}</Text>
                  </div>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(state.scriptPassword || '', t('result.credentials.passwordCopied'))}
                  >
                    {t('result.credentials.copy')}
                  </Button>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <Button 
                    type="primary" 
                    icon={<KeyOutlined />}
                    onClick={() => copyToClipboard(`ID: ${state.scriptId}\n${t('result.credentials.password')}: ${state.scriptPassword}`, t('result.credentials.allCopied'))}
                    style={{ width: '100%', color: '#fff' }}
                  >
                    {t('result.credentials.copyAll')}
                  </Button>
                </div>
              </div>
            )}
          </Result>
        ) : (
          // 失败结果
          <Result
            status="error"
            title={t('result.error.title')}
            subTitle={state.message || t('result.error.content')}
            icon={<CloseCircleOutlined />}
            extra={[
              <Button 
                key="back" 
                onClick={handleBackToUpload}
                icon={<ArrowLeftOutlined />}
              >
                {t('common.back')}
              </Button>,
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default ResultPage; 