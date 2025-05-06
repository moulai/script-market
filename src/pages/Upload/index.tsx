import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Modal,
  Typography,
  Divider,
  message,
  Spin,
  Radio,
  Switch,
  Row,
  Col,
  Badge
} from 'antd';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  KeyOutlined
} from '@ant-design/icons';

import { IScript } from '../../types/script';
import { isValidId, generateVersionFromTimestamp, isValidFileName } from '../../utils/validation';
import { encryptPassword } from '../../utils/crypto';
import { initFormDataReceiver } from '../../utils/formFiller';
import tagsList from '../../config/tagsList';
import githubService from '../../services/github';
import ImportButton from './components/ImportButton';

const { Paragraph } = Typography;
const { Option, OptGroup } = Select;

const UploadPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 状态
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scriptData, setScriptData] = useState<IScript | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // 文件已存在相关状态
  const [fileExistsVisible, setFileExistsVisible] = useState(false);
  const [_existingData, setExistingData] = useState<IScript | null>(null);
  const [passwordVerification, setPasswordVerification] = useState('');
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [actionLoading, setActionLoading] = useState<'update' | 'delete' | null>(null);
  
  // 初始化版本号
  useEffect(() => {
    form.setFieldsValue({
      version: generateVersionFromTimestamp()
    });
  }, [form]);
  
  // 初始化表单数据接收器
  useEffect(() => {
    // 设置表单数据接收器并获取清理函数
    const cleanup = initFormDataReceiver(form);
    
    // 组件卸载时清理
    return cleanup;
  }, [form]);
  
  // 语言切换
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setCurrentLanguage(value);
  };
  
  // 表单提交
  const handleSubmit = (values: any) => {
    // 保存原始密码用于显示
    const originalPassword = values.password;
    
    // 加密密码
    const encryptedPassword = encryptPassword(values.password);
    
    // 构造脚本数据
    const script: IScript = {
      id: values.id,
      password: encryptedPassword, // 存储加密后的密码
      name: values.name,
      author: values.author,
      version: values.version || generateVersionFromTimestamp(),
      tags: values.tags || [],
      content: values.content,
      info: values.info || '',
      buttons: values.buttons || [],
      createdAt: '',
      updatedAt: '',
      originalPassword: originalPassword // 保存原始密码以供显示
    };
    
    setScriptData(script);
    setConfirmVisible(true);
  };
  
  // 确认上传
  const handleConfirmUpload = async () => {
    if (!scriptData) return;
    
    setSubmitLoading(true);
    
    try {
      // 创建上传用的脚本对象，不包含originalPassword字段
      const uploadScript: IScript = {
        ...scriptData,
        originalPassword: undefined
      };
      
      const result = await githubService.uploadScript(uploadScript);
      
      if (result.success) {
        // 上传成功，跳转到结果页面
        navigate('/result', { 
          state: { 
            success: true, 
            message: result.message,
            url: result.url,
            scriptName: scriptData.name,
            scriptId: scriptData.id,
            scriptPassword: scriptData.originalPassword // 显示原始密码
          } 
        });
      } else if (result.fileExists) {
        // 文件已存在，显示处理选项
        setConfirmVisible(false);
        setExistingData(result.existingData || null);
        setFileExistsVisible(true);
        setSubmitLoading(false);
      } else {
        // 显示错误信息
        message.error(result.message);
        setConfirmVisible(false);
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error('上传脚本时出错:', error);
      message.error(t('上传失败，请重试'));
      setConfirmVisible(false);
      setSubmitLoading(false);
    }
  };
  
  // 处理文件存在的操作选择
  const handleFileExistsAction = async (action: 'update' | 'delete' | 'cancel') => {
    if (action === 'cancel') {
      setFileExistsVisible(false);
      setPasswordVerification('');
      setPasswordIncorrect(false);
      setActionLoading(null);
      return;
    }
    
    // 如果密码为空，显示错误提示
    if (!passwordVerification.trim()) {
      message.error(t('form.password.error'));
      return;
    }
    
    setActionLoading(action);
    
    if (!scriptData) return;
    
    try {
      // 创建上传用的脚本对象，不包含originalPassword字段
      const uploadScript: IScript = {
        ...scriptData,
        originalPassword: undefined
      };
      
      if (action === 'update') {
        // 更新脚本
        const result = await githubService.updateScript(uploadScript, passwordVerification);
        
        if (result.success) {
          // 更新成功
          navigate('/result', {
            state: {
              success: true,
              message: t('result.success.update'),
              url: result.url,
              scriptName: scriptData.name,
              scriptId: scriptData.id,
              scriptPassword: scriptData.originalPassword
            }
          });
        } else if (result.isPasswordCorrect === false) {
          // 密码不正确
          setPasswordIncorrect(true);
          setActionLoading(null);
        } else {
          // 其他错误
          setFileExistsVisible(false);
          message.error(result.message);
          setActionLoading(null);
        }
      } else if (action === 'delete') {
        // 删除脚本
        const result = await githubService.deleteScript(scriptData.id, passwordVerification);
        
        if (result.success) {
          // 删除成功
          navigate('/result', {
            state: {
              success: true,
              message: t('result.success.delete'),
              scriptName: scriptData.name,
              scriptId: scriptData.id
            }
          });
        } else if (result.isPasswordCorrect === false) {
          // 密码不正确
          setPasswordIncorrect(true);
          setActionLoading(null);
        } else {
          // 其他错误
          setFileExistsVisible(false);
          message.error(result.message);
          setActionLoading(null);
        }
      }
    } catch (error) {
      console.error('处理脚本时出错:', error);
      message.error(t('操作失败，请重试'));
      setFileExistsVisible(false);
      setActionLoading(null);
    }
  };
  
  // 取消确认
  const handleCancelConfirm = () => {
    setConfirmVisible(false);
  };
  
  // 验证ID
  const validateId = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('validation.required')));
    }
    if (!isValidId(value)) {
      return Promise.reject(new Error(t('validation.idFormat')));
    }
    return Promise.resolve();
  };
  
  // 验证名称
  const validateName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('validation.required')));
    }
    if (!isValidFileName(value)) {
      return Promise.reject(new Error(t('validation.nameFormat')));
    }
    return Promise.resolve();
  };
  
  return (
    <div className="container">
      <div className="header">
        <div className="header-title">{t('nav.title')}</div>
        <Radio.Group 
          value={currentLanguage} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="zh">中文</Radio.Button>
          <Radio.Button value="en">English</Radio.Button>
        </Radio.Group>
      </div>
      
      <Card className="form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={true}
        >
          {/* 基本信息部分 - 双列布局 */}
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="id"
                label={t('form.id.label')}
                rules={[{ validator: validateId }]}
                tooltip={t('form.id.help')}
                required
              >
                <Input placeholder={t('form.id.placeholder')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="password"
                label={t('form.password.label')}
                rules={[{ required: true, message: t('form.password.error') }]}
                tooltip={t('form.password.help')}
              >
                <Input.Password 
                  placeholder={t('form.password.placeholder')} 
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="name"
                label={t('form.name.label')}
                rules={[{ validator: validateName }]}
                required
              >
                <Input placeholder={t('form.name.placeholder')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="author"
                label={t('form.author.label')}
              >
                <Input placeholder={t('form.author.placeholder')} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="version"
                label={t('form.version.label')}
                tooltip={t('form.version.help')}
              >
                <Input placeholder={t('form.version.placeholder')} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="tags"
                label={t('form.tags.label')}
                tooltip={t('form.tags.help')}
              >
                <Select
                  mode="multiple"
                  placeholder={t('form.tags.placeholder')}
                  className="tag-select"
                >
                  {/* 按分类分组显示标签 */}
                  {Array.from(new Set(tagsList.map(tag => tag.category))).map(category => (
                    <OptGroup key={category} label={category}>
                      {tagsList
                        .filter(tag => tag.category === category)
                        .map(tag => (
                          <Option key={tag.label} value={tag.label}>
                            {tag.label}
                          </Option>
                        ))}
                    </OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider style={{ margin: '12px 0' }}>{t('form.buttons.label')}</Divider>
          
          {/* 按钮触发部分 - 表格式布局 */}
          <Form.List name="buttons">
            {(fields, actions) => (
              <>
                {fields.length > 0 && (
                  <div className="buttons-header" style={{ display: 'flex', marginBottom: '8px', fontWeight: 'bold' }}>
                    <div style={{ flex: '1 1 auto' }}>{t('form.buttons.name')}</div>
                    <div style={{ width: '100px', textAlign: 'center' }}>{t('form.buttons.visible')}</div>
                    <div style={{ width: '50px' }}></div>
                  </div>
                )}
                
                {fields.map((field) => (
                  <Row key={field.key} gutter={8} align="middle" style={{ marginBottom: '8px' }}>
                    <Col flex="auto">
                      <Form.Item
                        name={[field.name, 'name']}
                        rules={[{ required: true, message: t('validation.buttonNameRequired') }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder={t('form.buttons.name')} />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                      <Form.Item
                        name={[field.name, 'visible']}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                        initialValue={true}
                      >
                        <Switch
                          checkedChildren={t('form.buttons.visible')}
                          unCheckedChildren={t('form.buttons.invisible')}
                          defaultChecked
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => actions.remove(field.name)}
                        danger
                      />
                    </Col>
                  </Row>
                ))}
                
                <Form.Item style={{ marginTop: fields.length > 0 ? '16px' : '0' }}>
                  <Button
                    type="dashed"
                    onClick={() => actions.add({ name: '', visible: true })}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    {t('form.buttons.add')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <Divider style={{ margin: '12px 0' }}>{t('form.content.label')}</Divider>
          
          {/* 脚本内容部分 */}
          <Form.Item
            name="content"
            rules={[{ required: true, message: t('form.content.error') }]}
          >
            <Input.TextArea 
              rows={15} 
              placeholder={t('form.content.placeholder')}
              style={{ fontFamily: 'monospace' }}
              className="code-editor"
            />
          </Form.Item>
          
          <Form.Item
            name="info"
            label={t('form.info.label')}
          >
            <Input.TextArea 
              rows={4} 
              placeholder={t('form.info.placeholder')} 
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '30%' }}>
                <ImportButton form={form} />
              </div>
              <div style={{ width: '70%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<UploadOutlined />}
                  size="large"
                  style={{ width: '100%', color: '#fff' }}
                >
                  {t('common.upload')}
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 确认上传对话框 */}
      <Modal
        title={t('confirm.title')}
        open={confirmVisible}
        onOk={handleConfirmUpload}
        onCancel={handleCancelConfirm}
        okText={t('confirm.submit')}
        cancelText={t('confirm.cancel')}
        width={600}
        confirmLoading={submitLoading}
        okButtonProps={{ 
          icon: <UploadOutlined />,
          style: { 
            backgroundColor: '#1677ff', 
            borderColor: '#1677ff',
            color: '#fff' 
          } 
        }}
      >
        {submitLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>{t('common.loading')}</div>
          </div>
        ) : (
          <div>
            <Paragraph>{t('confirm.content')}</Paragraph>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="confirm-item">
                  <div className="confirm-label">{t('form.id.label')}:</div>
                  <div className="confirm-value">{scriptData?.id}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="confirm-item">
                  <div className="confirm-label">{t('form.name.label')}:</div>
                  <div className="confirm-value">{scriptData?.name}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="confirm-item">
                  <div className="confirm-label">{t('form.author.label')}:</div>
                  <div className="confirm-value">{scriptData?.author}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="confirm-item">
                  <div className="confirm-label">{t('form.version.label')}:</div>
                  <div className="confirm-value">{scriptData?.version}</div>
                </div>
              </Col>
            </Row>
            
            {scriptData?.tags && scriptData.tags.length > 0 && (
              <div className="confirm-item">
                <div className="confirm-label">{t('form.tags.label')}:</div>
                <div className="confirm-value confirm-tags">
                  {scriptData.tags.map(tag => {
                    const tagObj = tagsList.find(t => t.label === tag);
                    return (
                      <Badge 
                        key={tag} 
                        count={tagObj ? tagObj.label : tag} 
                        style={{ backgroundColor: '#1677ff', marginRight: 8, marginBottom: 8 }} 
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            {scriptData?.buttons && scriptData.buttons.length > 0 && (
              <div className="confirm-item">
                <div className="confirm-label">{t('form.buttons.label')}:</div>
                <div className="confirm-value confirm-buttons">
                  {scriptData.buttons.map((button, index) => (
                    <Badge 
                      key={index} 
                      count={button.name} 
                      style={{ 
                        backgroundColor: button.visible ? '#52c41a' : '#d9d9d9', 
                        marginRight: 8,
                        marginBottom: 8
                      }}
                      overflowCount={1000000000000000000}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {scriptData?.info && (
              <div className="confirm-item">
                <div className="confirm-label">{t('form.info.label')}:</div>
                <div className="confirm-info">
                  <ReactMarkdown>{scriptData.info}</ReactMarkdown>
                </div>
              </div>
            )}
            
            <div className="confirm-item">
              <div className="confirm-label">{t('form.content.label')}:</div>
              <pre className="confirm-code" style={{ maxHeight: '150px' }}>{scriptData?.content}</pre>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 文件已存在对话框 (集成密码验证) */}
      <Modal
        title={t('fileExists.title')}
        open={fileExistsVisible}
        footer={null}
        closable={false}
        width={500}
      >
        <div style={{ padding: '12px 0' }}>
          <Paragraph>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
            {t('fileExists.content')}
          </Paragraph>
          
          {/* 密码验证区域 */}
          <div style={{ margin: '16px 0' }}>
            <Paragraph>
              <KeyOutlined style={{ marginRight: 8, color: '#1677ff' }} />
              {t('fileExists.passwordVerify')}
            </Paragraph>
            
            <div style={{ marginBottom: 24 }}>
              <Input.Password
                value={passwordVerification}
                onChange={(e) => {
                  setPasswordVerification(e.target.value);
                  if (passwordIncorrect) setPasswordIncorrect(false);
                }}
                placeholder={t('form.password.placeholder')}
                status={passwordIncorrect ? 'error' : ''}
                autoFocus
              />
              {passwordIncorrect && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: 4 }}>
                  {t('form.password.incorrect')}
                </div>
              )}
            </div>
          </div>
          
          {/* 操作按钮区域 */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              onClick={() => handleFileExistsAction('update')}
              type="primary"
              icon={<EditOutlined />}
              loading={actionLoading === 'update'}
              style={{ width: '32%', color: '#fff' }}
            >
              {t('fileExists.updateScript')}
            </Button>
            
            <Button 
              onClick={() => handleFileExistsAction('delete')}
              danger
              icon={<DeleteOutlined />}
              loading={actionLoading === 'delete'}
              style={{ width: '32%' }}
            >
              {t('fileExists.deleteScript')}
            </Button>
            
            <Button 
              onClick={() => handleFileExistsAction('cancel')}
              icon={<ExclamationCircleOutlined />}
              style={{ width: '32%' }}
            >
              {t('fileExists.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadPage; 