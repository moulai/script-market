/**
 * 验证工具函数
 */

/**
 * 验证ID是否符合文件命名规范
 * 只允许字母、数字、下划线和连字符
 * @param id 要验证的ID
 * @returns 是否有效
 */
export const isValidId = (id: string): boolean => {
  // 文件命名规范：只允许字母、数字、下划线和连字符
  const pattern = /^[a-zA-Z0-9_-]+$/;
  return pattern.test(id);
};

/**
 * 验证文件名称是否符合命名规范
 * 不允许包含Windows和Linux文件系统中的非法字符
 * @param name 要验证的名称
 * @returns 是否有效
 */
export const isValidFileName = (name: string): boolean => {
  // 禁止使用的文件名字符： / \ : * ? " < > |
  const invalidChars = /[\\/:*?"<>|]/;
  return !invalidChars.test(name) && name.trim().length > 0;
};

/**
 * 验证字段是否为空
 * @param value 要验证的值
 * @returns 是否非空
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * 生成基于时间戳的版本号
 * @returns 版本号字符串
 */
export const generateVersionFromTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day}.${hours}${minutes}`;
}; 