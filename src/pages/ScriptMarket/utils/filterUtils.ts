/**
 * 筛选相关工具函数
 */
import { ScriptInfo } from '../types';
import i18next from 'i18next';

/**
 * 格式化日期
 * @param dateString ISO日期字符串
 * @param format 格式化选项
 */
export const formatDate = (dateString: string, format: 'full' | 'date' | 'relative' = 'full'): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return i18next.t('common.error');
    }
    
    // 获取当前语言
    const currentLanguage = i18next.language;
    const locale = currentLanguage === 'en' ? 'en-US' : 'zh-CN';
    
    if (format === 'relative') {
      // 相对时间（例如：3天前）
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffMonth / 12);
      
      if (diffYear > 0) {
        return i18next.t('scriptMarket.time.yearsAgo').replace('{count}', diffYear.toString());
      } else if (diffMonth > 0) {
        return i18next.t('scriptMarket.time.monthsAgo').replace('{count}', diffMonth.toString());
      } else if (diffDay > 0) {
        return i18next.t('scriptMarket.time.daysAgo').replace('{count}', diffDay.toString());
      } else if (diffHour > 0) {
        return i18next.t('scriptMarket.time.hoursAgo').replace('{count}', diffHour.toString());
      } else if (diffMin > 0) {
        return i18next.t('scriptMarket.time.minutesAgo').replace('{count}', diffMin.toString());
      } else {
        return i18next.t('scriptMarket.time.justNow');
      }
    } else if (format === 'date') {
      // 仅日期（例如：2025-05-05）
      return date.toLocaleDateString(locale);
    } else {
      // 完整日期时间（例如：2025-05-05 13:45:37）
      return date.toLocaleString(locale);
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * 提取所有唯一作者
 * @param scripts 脚本列表
 */
export const extractUniqueAuthors = (scripts: ScriptInfo[]): string[] => {
  return Array.from(new Set(scripts.map(script => script.author))).sort();
};

/**
 * 提取所有唯一标签
 * @param scripts 脚本列表
 */
export const extractUniqueTags = (scripts: ScriptInfo[]): string[] => {
  const allTags = scripts.flatMap(script => script.tags);
  return Array.from(new Set(allTags)).sort();
};

/**
 * 根据关键词搜索脚本
 * @param scripts 脚本列表
 * @param keyword 关键词
 */
export const searchScriptsByKeyword = (scripts: ScriptInfo[], keyword: string): ScriptInfo[] => {
  if (!keyword.trim()) {
    return scripts;
  }
  
  const lowerKeyword = keyword.toLowerCase();
  
  return scripts.filter(script => 
    script.name.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * 根据标签筛选脚本
 * @param scripts 脚本列表
 * @param tags 标签列表
 */
export const filterScriptsByTags = (scripts: ScriptInfo[], tags: string[]): ScriptInfo[] => {
  if (tags.length === 0) {
    return scripts;
  }
  
  return scripts.filter(script => 
    tags.some(tag => script.tags.includes(tag))
  );
};

/**
 * 根据作者筛选脚本
 * @param scripts 脚本列表
 * @param author 作者
 */
export const filterScriptsByAuthor = (scripts: ScriptInfo[], author: string | null): ScriptInfo[] => {
  if (!author) {
    return scripts;
  }
  
  return scripts.filter(script => script.author === author);
};

/**
 * 排序脚本列表
 * @param scripts 脚本列表
 * @param sortBy 排序字段
 * @param sortOrder 排序方向
 */
export const sortScripts = (
  scripts: ScriptInfo[], 
  sortBy: 'updatedAt' | 'createdAt' | 'name',
  sortOrder: 'asc' | 'desc'
): ScriptInfo[] => {
  return [...scripts].sort((a, b) => {
    let result = 0;
    
    if (sortBy === 'name') {
      result = a.name.localeCompare(b.name);
    } else if (sortBy === 'createdAt') {
      result = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      result = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    
    return sortOrder === 'asc' ? -result : result;
  });
};