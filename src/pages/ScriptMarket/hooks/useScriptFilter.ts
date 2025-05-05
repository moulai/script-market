import { useState, useMemo } from 'react';
import { ScriptInfo, FilterCondition } from '../types';

/**
 * 脚本筛选逻辑Hook
 * 负责处理脚本的筛选和搜索
 * @param scripts 脚本列表数据
 */
export const useScriptFilter = (scripts: ScriptInfo[]) => {
  // 筛选条件
  const [filterCondition, setFilterCondition] = useState<FilterCondition>({
    searchText: '',
    selectedTags: [],
    selectedAuthor: null
  });
  
  // 提取所有作者列表（去重）
  const authors = useMemo(() => {
    return Array.from(new Set(scripts.map(script => script.author))).sort();
  }, [scripts]);
  
  // 提取所有标签列表（去重）
  const tags = useMemo(() => {
    const allTags = scripts.flatMap(script => script.tags);
    return Array.from(new Set(allTags)).sort();
  }, [scripts]);
  
  // 根据筛选条件过滤脚本
  const filteredScripts = useMemo(() => {
    return scripts
      .filter(script => {
        // 关键词搜索（只搜索名称）
        const nameMatch = !filterCondition.searchText ||
          script.name.toLowerCase().includes(filterCondition.searchText.toLowerCase());
        
        // 标签筛选
        const tagMatch = filterCondition.selectedTags.length === 0 ||
          filterCondition.selectedTags.some(tag => script.tags.includes(tag));
        
        // 作者筛选（支持部分匹配）
        const authorMatch = !filterCondition.selectedAuthor ||
          script.author.toLowerCase().includes(filterCondition.selectedAuthor.toLowerCase());
        
        return nameMatch && tagMatch && authorMatch;
      })
      .sort((a, b) => {
        // 默认按更新时间降序排序
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [scripts, filterCondition]);
  
  // 设置搜索文本
  const setSearchText = (text: string) => {
    setFilterCondition(prev => ({ ...prev, searchText: text }));
  };
  
  // 设置选中的标签
  const setSelectedTags = (tags: string[]) => {
    setFilterCondition(prev => ({ ...prev, selectedTags: tags }));
  };
  
  // 设置选中的作者
  const setSelectedAuthor = (author: string | null) => {
    setFilterCondition(prev => ({ ...prev, selectedAuthor: author }));
  };
  
  return {
    filteredScripts,
    authors,
    tags,
    setSearchText,
    setSelectedTags,
    setSelectedAuthor
  };
};