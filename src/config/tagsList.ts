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
  
  /**
   * 标签颜色
   * 可以是预设颜色名称或十六进制颜色代码
   * 如果未设置，将根据分类或标签名自动生成
   */
  color?: string;
}

/**
 * 分类颜色映射
 * 为不同分类设置默认颜色
 */
export const categoryColorMap: Record<string, string> = {
  '功能': 'green',
  '技术': 'blue',
  '场景': 'purple',
};

/**
 * 预设标签列表
 * 可以根据需要添加或修改标签
 */
const tagsList: ITag[] = [
  // 功能类标签
  { label: '自动化', category: '功能', color: 'green' },
  { label: '数据处理', category: '功能', color: 'cyan' },
  { label: '实用工具', category: '功能' },
  { label: 'UI增强', category: '功能', color: 'lime' },
  
  // 技术类标签
  { label: 'JavaScript', category: '技术', color: 'gold' },
  { label: 'TypeScript', category: '技术', color: 'blue' },
  { label: 'React', category: '技术', color: 'geekblue' },
  { label: 'Vue', category: '技术', color: 'green' },
  
  // 应用场景标签
  { label: '浏览器', category: '场景', color: 'orange' },
  { label: '桌面应用', category: '场景' },
  { label: '移动设备', category: '场景', color: 'magenta' },
  { label: '服务器', category: '场景', color: 'volcano' },
];

export default tagsList;