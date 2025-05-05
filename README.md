# 脚本市场上传页面

一个简洁明了的静态网页项目，用于上传脚本到GitHub仓库。

## 功能特点

- 📝 脚本信息上传界面（ID、密码、名称、作者、版本等）
- 🌐 支持多语言（中文/英文）
- 📱 响应式设计，适配各种设备屏幕
- 🔄 使用GitHub REST API上传数据
- 🧩 模块化设计，易于扩展和维护
- 🎨 美观直观的用户界面
- 🔑 安全的密码管理机制

## 项目预览

![上传表单](./docs/form-preview.png)

## 快速开始

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/yourusername/script-market.git
cd script-market
```

2. 安装依赖
```bash
npm install
# 或使用yarn
yarn
```

3. 添加环境变量
创建`.env.local`文件，并添加以下内容（替换为您的实际值）：
```
VITE_GITHUB_TOKEN=your_github_token
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=your_github_repo
VITE_GITHUB_BRANCH=main
VITE_PASSWORD_SALT=your_password_salt
```

4. 启动开发服务器
```bash
npm run dev
# 或使用yarn
yarn dev
```

5. 在浏览器中访问 `http://localhost:5173`

### 构建部署

1. 构建项目
```bash
npm run build
# 或使用yarn
yarn build
```

2. 部署生成的`dist`文件夹到您的Web服务器或GitHub Pages

## GitHub Token说明

### 如何获取GitHub Token

1. 登录GitHub账户
2. 点击右上角头像 -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens
3. 点击"Generate new token"
4. 填写Token名称，例如"Script Market Upload"
5. 选择Token的“Repository access”为存放脚本的GitHub仓库
6. 选择“Repository permissions”中的`contents`权限为`read`和`write`
7. 选择“Repository permissions”中的`metadata`权限为`read`（应该是自动的）

### 安全注意事项

- **永远不要**在客户端代码中硬编码GitHub Token
- 对于生产环境，推荐使用环境变量或安全的密钥管理服务
- 定期轮换Token以提高安全性
- 仅授予Token必要的最小权限集
- 不要在公共仓库中提交包含Token的`.env`文件

## 项目配置

### GitHub API配置

在`.env.local`文件中配置您的GitHub Token和仓库信息：

```
VITE_GITHUB_TOKEN=your_github_token
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=your_github_repo
VITE_GITHUB_BRANCH=main
```

此配置会被`src/config/githubConfig.ts`文件读取：

```typescript
const githubConfig: IGithubConfig = {
  token: import.meta.env.VITE_GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN',
  owner: import.meta.env.VITE_GITHUB_OWNER || 'your-username',
  repo: import.meta.env.VITE_GITHUB_REPO || 'your-repo',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
};
```

### 标签配置

在`src/config/tagsList.ts`中配置预设标签：

```typescript
const tagsList: ITag[] = [
  { value: 'automation', label: '自动化', category: '功能' },
  // 添加更多标签...
];
```

### 密码加密
在`.env.local`文件中配置密码加密盐：

```
VITE_PASSWORD_SALT=your_password_salt
```
此配置会被`src/utils/crypto.ts`文件读取：

```typescript
const passwordSalt = import.meta.env.VITE_PASSWORD_SALT || 'your_password_salt';
```

上传到脚本仓库的脚本，其存储的密码会使用该盐进行加密。请确保该盐的安全性，避免泄露。

## 文件存储结构

上传的脚本将以JSON文件的形式存储在指定的GitHub仓库的`script_dist`文件夹中。文件命名使用脚本ID，格式为：`{scriptId}.json`。

JSON文件包含所有脚本信息，包括ID、名称、作者、版本、标签、内容、按钮配置等。

## 表单预填充功能

脚本市场上传页面支持通过外部系统预填充表单数据，方便从其他系统直接调用并自动填写表单。

查看 `form-prefill-example.html` 文件，了解如何使用预填充功能。

支持以下两种方式：

### 1. URL参数方式

可以通过URL参数传递JSON数据来预填充表单：

- **使用`json`参数**：适用于较短的数据
  ```
  https://your-site.com/?json={"id":"script-001","name":"测试脚本","content":"console.log('Hello')"}
  ```

- **使用`data`参数**：适用于较长的数据，使用base64编码
  ```
  https://your-site.com/?data=eyJpZCI6InNjcmlwdC0wMDEiLCJuYW1lIjoi5rWL6K+V6ISa5pysIiwiY29udGVudCI6ImNvbnNvbGUubG9nKCdIZWxsbycpIn0=
  ```

### 2. postMessage API方式

可以通过浏览器的postMessage API从父窗口向脚本市场页面发送数据：

```javascript
// 在父窗口中执行
const scriptData = {
  id: "script-001",
  name: "测试脚本",
  author: "测试作者",
  content: "console.log('Hello World')",
  // 其他字段...
};

// 获取iframe引用
const iframe = document.getElementById('script-market-iframe');
// 发送消息
iframe.contentWindow.postMessage(scriptData, 'https://your-script-market-url.com');
```

### 支持的字段

预填充功能支持以下字段：

- `id`: 脚本ID
- `password`: 更新密码
- `name`: 脚本名称
- `author`: 作者名称
- `version`: 版本号
- `tags`: 标签数组
- `content`: 脚本内容
- `info`: 备注信息
- `buttons`: 按钮配置数组

## 技术栈

- React - 用户界面库
- TypeScript - 静态类型检查
- Vite - 构建工具
- Ant Design - UI组件库
- i18next - 国际化
- Octokit - GitHub API客户端

## 贡献指南

欢迎贡献！请随时提交Issue或Pull Request。

## 许可证

MIT 