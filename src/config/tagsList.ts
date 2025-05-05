/**
 * 脚本标签列表
 * 用于在上传表单中显示的预设标签选项
 */

export interface ITag {
  /**
   * 标签值，用于保存
   */
  value: string;
  
  /**
   * 标签显示名称，可以是中文
   */
  label: string;
  
  /**
   * 分类，用于标签分组展示
   */
  category?: string;
}

/**
 * 预设标签列表
 * 可以根据需要添加或修改标签
 */
const tagsList: ITag[] = [
  // 功能类标签
  { value: 'automation', label: '自动化', category: '功能' },
  { value: 'data-processing', label: '数据处理', category: '功能' },
  { value: 'utility', label: '实用工具', category: '功能' },
  { value: 'ui-enhancement', label: 'UI增强', category: '功能' },
  
  // 技术类标签
  { value: 'javascript', label: 'JavaScript', category: '技术' },
  { value: 'typescript', label: 'TypeScript', category: '技术' },
  { value: 'react', label: 'React', category: '技术' },
  { value: 'vue', label: 'Vue', category: '技术' },
  
  // 应用场景标签
  { value: 'browser', label: '浏览器', category: '场景' },
  { value: 'desktop', label: '桌面应用', category: '场景' },
  { value: 'mobile', label: '移动设备', category: '场景' },
  { value: 'server', label: '服务器', category: '场景' },
];

export default tagsList; 