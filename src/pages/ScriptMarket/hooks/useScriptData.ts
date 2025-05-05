import { useState, useEffect, useCallback } from 'react';
import { ScriptInfo } from '../types';

/**
 * 脚本数据处理Hook
 * 负责获取和管理脚本数据
 */
export const useScriptData = () => {
  // 脚本列表数据
  const [scripts, setScripts] = useState<ScriptInfo[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState<Error | null>(null);
  // 最后更新时间
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  /**
   * 获取脚本列表数据
   */
  const fetchScriptList = useCallback(async () => {
    try {
      setLoading(true);
      // 使用 import.meta.env.BASE_URL 获取正确的基础路径
      // 添加时间戳参数和禁用缓存的请求头，确保每次都获取最新数据
      const response = await fetch(`${import.meta.env.BASE_URL}index.json?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取脚本列表失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setScripts(data.scripts);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error('获取脚本列表出错:', err);
      setError(err instanceof Error ? err : new Error('未知错误'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * 获取单个脚本详情
   * @param scriptId 脚本ID
   */
  const fetchScriptDetail = useCallback(async (scriptId: string) => {
    try {
      // 使用 import.meta.env.BASE_URL 获取正确的基础路径
      // 添加时间戳参数和禁用缓存的请求头，确保每次都获取最新数据
      const response = await fetch(`${import.meta.env.BASE_URL}script_dist/${scriptId}.json?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取脚本详情失败: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error(`获取脚本 ${scriptId} 详情出错:`, err);
      throw err;
    }
  }, []);
  
  // 组件挂载时获取脚本列表
  useEffect(() => {
    fetchScriptList();
  }, [fetchScriptList]);
  
  // 返回数据和方法
  return {
    scripts,
    loading,
    error,
    lastUpdated,
    fetchScriptList,
    fetchScriptDetail
  };
};