/**
 * 脚本标签列表
 * 用于在上传表单中显示的预设标签选项
 */

export interface ITag {
  /**
   * 标签名称，同时用于显示和保存
   * 可以是中文或英文
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
  { label: '自动化', category: '功能' },
  { label: '数据处理', category: '功能' },
  { label: '实用工具', category: '功能' },
  { label: 'UI增强', category: '功能' },
  
  // 技术类标签
  { label: 'JavaScript', category: '技术' },
  { label: 'TypeScript', category: '技术' },
  { label: 'React', category: '技术' },
  { label: 'Vue', category: '技术' },
  
  // 应用场景标签
  { label: '浏览器', category: '场景' },
  { label: '桌面应用', category: '场景' },
  { label: '移动设备', category: '场景' },
  { label: '服务器', category: '场景' },
];

export default tagsList;