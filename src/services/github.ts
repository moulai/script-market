/// <reference types="node" />

import { Octokit } from '@octokit/rest';
import { IScript } from '../types/script';
import githubConfig from '../config/githubConfig';
import { Buffer } from 'buffer';
import { verifyPassword } from '../utils/crypto';

// @ts-ignore
window.Buffer = Buffer;

/**
 * GitHub API服务
 * 用于与GitHub进行交互，上传脚本文件
 */
class GitHubService {
  private octokit: Octokit;
  
  constructor() {
    this.octokit = new Octokit({
      auth: githubConfig.token,
    });
  }
  
  /**
   * 上传脚本到GitHub仓库
   * @param script 脚本信息
   * @returns 上传结果
   */
  async uploadScript(script: IScript): Promise<{ 
    success: boolean; 
    message: string; 
    url?: string; 
    fileExists?: boolean; 
    isPasswordCorrect?: boolean;
    existingData?: IScript;
  }> {
    try {
      // 文件路径
      const filePath = `public/script_dist/${script.id}.json`;
      
      // 检查文件是否已存在
      const existingFile = await this.checkFileExists(filePath);
      
      // 准备时间戳信息
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      
      // 如果文件已存在，尝试获取原始的创建时间和验证密码
      if (existingFile.exists && existingFile.content) {
        try {
          const existingData = JSON.parse(existingFile.content) as IScript;
          
          // 文件存在，返回信息供前端处理
          return {
            success: false,
            message: `ID为 ${script.id} 的脚本已存在`,
            fileExists: true,
            existingData: existingData
          };
        } catch (e) {
          console.error('解析现有文件失败:', e);
        }
      }
      
      // 准备JSON数据
      const jsonContent = JSON.stringify(
        {
          ...script,
          createdAt,
          updatedAt,
        },
        null,
        2
      );
      
      // Base64编码内容
      const contentBase64 = Buffer.from(jsonContent).toString('base64');
      
      // 如果文件不存在，直接创建
      if (!existingFile.exists) {
        // 创建文件
        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: githubConfig.owner,
          repo: githubConfig.repo,
          path: filePath,
          message: `Add script: ${script.name} by ${script.author || 'Anonymous'}`,
          content: contentBase64,
          branch: githubConfig.branch,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        
        return {
          success: true,
          message: '脚本上传成功',
          url: response.data.content?.html_url,
        };
      } else {
        // 文件已存在，但前面应该已经处理了这种情况并返回了结果
        // 这里只是为了逻辑完整性
        return {
          success: false,
          message: `ID为 ${script.id} 的脚本已存在`,
          fileExists: true
        };
      }
    } catch (error) {
      console.error('上传脚本时出错:', error);
      return {
        success: false,
        message: `上传失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }
  
  /**
   * 检查文件是否已存在
   * @param filePath 文件路径
   * @returns 是否存在和文件信息
   */
  private async checkFileExists(filePath: string): Promise<{ exists: boolean; sha?: string; content?: string }> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: filePath,
        ref: githubConfig.branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      // 文件存在，处理响应数据
      const data = response.data as { sha: string; content?: string; encoding?: string };
      
      let decodedContent: string | undefined;
      
      // 解码内容（如果存在）
      if (data.content && data.encoding === 'base64') {
        decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
      }
      
      return { 
        exists: true, 
        sha: data.sha,
        content: decodedContent
      };
    } catch (error) {
      // 404错误表示文件不存在
      if (error instanceof Error && 'status' in error && (error as any).status === 404) {
        return { exists: false };
      }
      // 其他错误重新抛出
      throw error;
    }
  }
  
  /**
   * 更新已存在的文件
   * @param script 脚本信息
   * @param plainPassword 用户输入的原始密码
   * @returns 更新结果
   */
  async updateScript(script: IScript, plainPassword: string): Promise<{ 
    success: boolean; 
    message: string; 
    url?: string;
    isPasswordCorrect?: boolean;
  }> {
    try {
      // 文件路径
      const filePath = `public/script_dist/${script.id}.json`;
      
      // 检查文件是否存在并获取内容
      const existingFile = await this.checkFileExists(filePath);
      
      if (!existingFile.exists || !existingFile.content || !existingFile.sha) {
        return {
          success: false,
          message: '找不到要更新的脚本'
        };
      }
      
      // 解析现有数据
      const existingData = JSON.parse(existingFile.content) as IScript;
      
      // 验证密码
      const isPasswordCorrect = verifyPassword(plainPassword, existingData.password);
      
      if (!isPasswordCorrect) {
        return {
          success: false,
          message: '密码不正确，无法更新脚本',
          isPasswordCorrect: false
        };
      }
      
      // 保留创建时间，更新修改时间
      const createdAt = existingData.createdAt;
      const updatedAt = new Date().toISOString();
      
      // 准备JSON数据
      const jsonContent = JSON.stringify(
        {
          ...script,
          createdAt,
          updatedAt,
        },
        null,
        2
      );
      
      // Base64编码内容
      const contentBase64 = Buffer.from(jsonContent).toString('base64');
      
      // 更新文件
      const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: filePath,
        message: `Update script: ${script.name}`,
        content: contentBase64,
        sha: existingFile.sha,
        branch: githubConfig.branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      return {
        success: true,
        message: '脚本更新成功',
        url: response.data.content?.html_url,
        isPasswordCorrect: true
      };
    } catch (error) {
      console.error('更新脚本时出错:', error);
      return {
        success: false,
        message: `更新失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
  
  /**
   * 删除脚本文件
   * @param scriptId 脚本ID
   * @param plainPassword 用户输入的原始密码
   * @returns 删除结果
   */
  async deleteScript(scriptId: string, plainPassword: string): Promise<{
    success: boolean;
    message: string;
    isPasswordCorrect?: boolean;
  }> {
    try {
      // 文件路径
      const filePath = `public/script_dist/${scriptId}.json`;
      
      // 检查文件是否存在并获取内容
      const existingFile = await this.checkFileExists(filePath);
      
      if (!existingFile.exists || !existingFile.content || !existingFile.sha) {
        return {
          success: false,
          message: '找不到要删除的脚本'
        };
      }
      
      // 解析现有数据
      const existingData = JSON.parse(existingFile.content) as IScript;
      
      // 验证密码
      const isPasswordCorrect = verifyPassword(plainPassword, existingData.password);
      
      if (!isPasswordCorrect) {
        return {
          success: false,
          message: '密码不正确，无法删除脚本',
          isPasswordCorrect: false
        };
      }
      
      // 删除文件
      await this.octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: filePath,
        message: `Delete script: ${existingData.name || scriptId}`,
        sha: existingFile.sha,
        branch: githubConfig.branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      return {
        success: true,
        message: '脚本删除成功',
        isPasswordCorrect: true
      };
    } catch (error) {
      console.error('删除脚本时出错:', error);
      return {
        success: false,
        message: `删除失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}

export default new GitHubService(); 