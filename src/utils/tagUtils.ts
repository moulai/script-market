import tagsList, { categoryColorMap } from '../config/tagsList';

/**
 * 预设的Ant Design颜色列表
 */
const presetColors = [
  'magenta', 'red', 'volcano', 'orange', 'gold',
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
];

/**
 * 根据字符串生成一个稳定的哈希值
 * @param str 输入字符串
 * @returns 哈希值
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * 根据字符串生成一个稳定的颜色
 * @param str 输入字符串
 * @returns 颜色名称
 */
const generateColorFromString = (str: string): string => {
  const hash = hashString(str);
  return presetColors[hash % presetColors.length];
};

/**
 * 根据标签名称获取对应的颜色
 * @param tagName 标签名称
 * @returns 对应的颜色代码
 */
export const getTagColor = (tagName: string): string => {
  // 查找标签信息
  const tagInfo = tagsList.find(t => t.label === tagName);
  
  // 如果找不到标签信息，根据标签名生成颜色
  if (!tagInfo) {
    return generateColorFromString(tagName);
  }
  
  // 如果标签有指定颜色，直接使用
  if (tagInfo.color) {
    return tagInfo.color;
  }
  
  // 如果标签有分类，使用分类的默认颜色
  if (tagInfo.category && categoryColorMap[tagInfo.category]) {
    return categoryColorMap[tagInfo.category];
  }
  
  // 如果没有分类或分类没有默认颜色，根据标签名生成颜色
  return generateColorFromString(tagName);
};