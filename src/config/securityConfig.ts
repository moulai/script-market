/**
 * 安全配置
 * 存储与安全相关的配置项
 */

interface ISecurityConfig {
  /**
   * 密码加盐值
   * 用于密码加密时与原密码组合，提高安全性
   */
  passwordSalt: string;
}

/**
 * 安全配置
 * 优先使用环境变量，如果没有则使用默认值
 */
const securityConfig: ISecurityConfig = {
  passwordSalt: import.meta.env.VITE_PASSWORD_SALT || 'default_salt_value',
};

export default securityConfig; 