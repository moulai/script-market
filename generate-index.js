import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扫描script_dist目录中的所有.json文件
const script_distDir = path.join(__dirname, 'script_dist');
const files = fs.readdirSync(script_distDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json');

console.log(`找到 ${files.length} 个脚本文件`);

// 收集所有脚本的信息
const scripts = [];
for (const file of files) {
  try {
    const filePath = path.join(script_distDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const script = JSON.parse(content);
    
    // 计算文件的SHA-256哈希值
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    // 提取需要的信息
    scripts.push({
      id: script.id,
      name: script.name,
      author: script.author,
      tags: script.tags,
      version: script.version,
      updatedAt: script.updatedAt,
      createdAt: script.createdAt,
      sha: hash
    });
    
    console.log(`处理文件: ${file}`);
  } catch (error) {
    console.error(`处理文件 ${file} 时出错:`, error);
  }
}

// 按更新时间排序（最新的在前面）
scripts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

// 生成index.json
const index = {
  total: scripts.length,
  lastUpdated: new Date().toISOString(),
  scripts
};

// 写入index.json
fs.writeFileSync(path.join(__dirname, 'index.json'), JSON.stringify(index, null, 2));
console.log('成功生成 index.json');