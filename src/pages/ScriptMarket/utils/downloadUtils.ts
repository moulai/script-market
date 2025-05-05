/**
 * 下载相关工具函数
 */

/**
 * 下载脚本文件
 * @param scriptId 脚本ID
 * @param scriptContent 脚本内容
 * @param fileName 文件名（可选，默认为脚本ID）
 */
export const downloadScript = (scriptId: string, scriptContent: string, fileName?: string) => {
  try {
    // 创建Blob对象
    const blob = new Blob([scriptContent], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    
    // 创建a标签并模拟点击
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `${scriptId}.json`;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('下载脚本文件失败:', error);
    return false;
  }
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      // 使用现代Clipboard API
      await navigator.clipboard.writeText(text);
    } else {
      // 兼容性处理
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
};