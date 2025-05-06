import React, { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { importFromJsonFile, isValidJsonFile } from '../../../utils/importUtils';

interface ImportButtonProps {
  form: FormInstance;
}

/**
 * 导入JSON文件按钮组件
 * 用于上传JSON文件并填充表单
 */
const ImportButton: React.FC<ImportButtonProps> = ({ form }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!isValidJsonFile(file)) {
      message.error(t('import.invalidFileType', '请上传有效的JSON文件'));
      return;
    }

    setLoading(true);

    try {
      // 导入JSON文件并填充表单
      await importFromJsonFile(file, form);
      message.success(t('import.success', '导入成功'));
    } catch (error) {
      console.error('导入JSON文件失败:', error);
      message.error(t('import.error', '导入失败，请检查文件格式'));
    } finally {
      setLoading(false);
      // 重置文件输入，以便可以再次选择同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 点击按钮时触发文件选择
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
      <Button
        icon={<ImportOutlined />}
        loading={loading}
        size="large"
        style={{ width: '100%' }}
        onClick={handleButtonClick}
      >
        {t('import.button', '导入')}
      </Button>
    </>
  );
};

export default ImportButton;