/**
 * 密码加密工具函数
 */
import CryptoJS from 'crypto-js';
import securityConfig from '../config/securityConfig';

/**
 * 使用SHA-256算法加密密码
 * 将用户密码与系统盐值组合后进行加密
 * 
 * @param plainPassword 原始密码
 * @returns 加密后的密码
 */
export const encryptPassword = (plainPassword: string): string => {
  const salt = securityConfig.passwordSalt;
  const saltedPassword = `${plainPassword}${salt}`;
  return CryptoJS.SHA256(saltedPassword).toString();
};

/**
 * 验证密码是否匹配
 * 
 * @param plainPassword 用户输入的原始密码
 * @param encryptedPassword 存储的加密密码
 * @returns 密码是否匹配
 */
export const verifyPassword = (plainPassword: string, encryptedPassword: string): boolean => {
  const encryptedInput = encryptPassword(plainPassword);
  return encryptedInput === encryptedPassword;
}; 