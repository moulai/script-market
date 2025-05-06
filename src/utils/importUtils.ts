import { IScript } from '../types/script';
import { FormInstance } from 'antd';
import { fillFormWithData } from './formFiller';

/**
 * 从JSON文件导入数据并填充表单
 * @param file 上传的JSON文件
 * @param form Ant Design表单实例
 * @returns Promise<boolean> 导入是否成功
 */
export const importFromJsonFile = (file: File, form: FormInstance): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // 创建文件读取器
    const reader = new FileReader();
    
    // 设置读取完成后的回调
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('读取文件失败');
        }
        
        // 解析JSON数据
        const jsonData = JSON.parse(event.target.result) as Partial<IScript>;
        
        // 验证数据格式
        if (!jsonData || typeof jsonData !== 'object') {
          throw new Error('无效的JSON格式');
        }
        
        // 排除密码字段
        const { password, originalPassword, ...safeData } = jsonData;
        
        // 填充表单（不包含密码字段）
        fillFormWithData(form, safeData);
        console.log('成功从JSON文件导入数据:', jsonData);
        
        // 导入成功
        resolve(true);
      } catch (error) {
        console.error('导入JSON文件时出错:', error);
        reject(error);
      }
    };
    
    // 设置读取错误的回调
    reader.onerror = (error) => {
      console.error('读取文件时出错:', error);
      reject(error);
    };
    
    // 以文本形式读取文件
    reader.readAsText(file);
  });
};

/**
 * 验证文件是否为有效的JSON文件
 * @param file 要验证的文件
 * @returns boolean 是否为有效的JSON文件
 */
export const isValidJsonFile = (file: File): boolean => {
  return file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
};