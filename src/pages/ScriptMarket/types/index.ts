/**
 * 脚本目录页面类型定义
 */
import { IScript } from '../../../types/script';

/**
 * 脚本信息类型
 * 用于列表展示的脚本基本信息
 */
export interface ScriptInfo {
  id: string;
  name: string;
  author: string;
  tags: string[];
  version: string;
  updatedAt: string;
  createdAt: string;
  sha: string;
}

/**
 * 筛选条件类型
 */
export interface FilterCondition {
  searchText: string;
  selectedTags: string[];
  selectedAuthor: string | null;
}

/**
 * 筛选栏属性类型
 */
export interface FilterBarProps {
  onSearch: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onAuthorChange: (author: string | null) => void;
  tags: string[];
}

/**
 * 脚本列表属性类型
 */
export interface ScriptListProps {
  scripts: ScriptInfo[];
  loading: boolean;
  onScriptSelect: (scriptId: string) => void;
}

/**
 * 卡片视图属性类型
 */
export interface CardViewProps {
  scripts: ScriptInfo[];
  onScriptSelect: (scriptId: string) => void;
}

/**
 * 表格视图属性类型
 */
export interface TableViewProps {
  scripts: ScriptInfo[];
  onScriptSelect: (scriptId: string) => void;
}

/**
 * 脚本行属性类型
 * 注意：ScriptRow不是标准React组件，而是返回表格行数据的函数
 */
export interface ScriptRowProps {
  script: ScriptInfo;
  onSelect: (scriptId: string) => void;
}

/**
 * 脚本表格行数据类型
 */
export interface ScriptRowData {
  key: string;
  name: React.ReactNode;
  author: string;
  tags: React.ReactNode;
  version: string;
  updatedAt: React.ReactNode;
  action: React.ReactNode;
}

/**
 * 脚本详情模态框属性类型
 */
export interface ScriptDetailModalProps {
  visible: boolean;
  scriptId: string | null;
  onClose: () => void;
}

/**
 * 页脚属性类型
 */
export interface FooterProps {
  total: number;
  lastUpdated: string;
}

/**
 * 头部属性类型
 */
export interface HeaderProps {
  onLanguageChange?: (language: string) => void;
}