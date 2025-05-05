/**
 * 脚本信息接口
 * 定义上传脚本需要的所有字段
 */
export interface IScript {
  /**
   * 脚本ID，用作文件名称
   * 必须符合文件命名规范
   */
  id: string;
  
  /**
   * 更新与删除密码
   * 用于后续脚本更新和删除操作的认证
   */
  password: string;
  
  /**
   * 脚本名称
   */
  name: string;
  
  /**
   * 作者名称
   */
  author: string;
  
  /**
   * 版本号
   * 默认根据时间戳自动生成
   */
  version: string;
  
  /**
   * 标签列表
   * 从预设列表中多选
   */
  tags: string[];
  
  /**
   * 脚本内容
   * 通常是JS或TS代码
   */
  content: string;
  
  /**
   * 作者备注信息
   */
  info: string;
  
  /**
   * 按钮触发配置
   */
  buttons: IButton[];

  /**
   * 创建时间
   */
  createdAt: string;
  
  /**
   * 更新时间
   */
  updatedAt: string;
  
  /**
   * 原始密码（仅前端使用，不存储）
   * 用于在界面显示原始密码，而不是加密后的密码
   */
  originalPassword?: string;
}

/**
 * 按钮接口
 * 定义按钮触发的配置
 */
export interface IButton {
  /**
   * 按钮名称
   */
  name: string;
  
  /**
   * 按钮是否可见
   */
  visible: boolean;
}

/**
 * 脚本表单验证状态
 */
export interface IScriptValidation {
  id: boolean;
  password: boolean;
  name: boolean;
  author: boolean;
  content: boolean;
} 