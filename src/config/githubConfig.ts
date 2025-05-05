/**
 * GitHub API配置
 * 注意: 在生产环境中，请确保Token保存在安全的地方，不要直接写在代码中
 */

interface IGithubConfig {
  /**
   * 用于GitHub API认证的Token
   * 需要有repo权限
   */
  token: string;
  
  /**
   * 目标仓库的所有者
   */
  owner: string;
  
  /**
   * 目标仓库名称
   */
  repo: string;
  
  /**
   * 分支名称
   */
  branch: string;
}

/**
 * GitHub配置
 * 优先使用环境变量，如果没有则使用默认值
 */
const githubConfig: IGithubConfig = {
  token: import.meta.env.VITE_GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN',
  owner: import.meta.env.VITE_GITHUB_OWNER || 'your-username',
  repo: import.meta.env.VITE_GITHUB_REPO || 'your-repo',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
};

export default githubConfig; 