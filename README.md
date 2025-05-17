# 脚本市场

一个简洁明了的静态网页项目，用于上传脚本到GitHub仓库以及浏览、下载脚本。

## 功能特点

- 📚 脚本目录浏览页面，支持筛选和搜索功能（访问端口：/#）
- 📝 脚本上传界面（ID、密码、名称、作者、版本等）（访问端口：/#/upload）
- 🔍 脚本详情查看，包括代码预览和详细信息
- ⬇️ 脚本一键下载功能
- 🌐 支持多语言（中文/英文）
- 📱 响应式设计，适配各种设备屏幕
- 🔄 使用GitHub REST API上传和获取数据
- 🧩 模块化设计，易于扩展和维护
- 🎨 美观直观的用户界面
- 🔑 简单但有效的密码管理机制
- 🔄 动态下载/导入按钮，支持与其他应用集成

## 项目预览

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
   - 上传页面：`http://localhost:5173/#/upload`
   - 脚本目录页面：`http://localhost:5173/#/`

### 构建部署

1. 构建项目
```bash
npm run build
# 或使用yarn
yarn build
```

2. 部署生成的`dist`文件夹到您的Web服务器或GitHub Pages

### 部署到 GitHub Pages

本项目支持自动部署到 GitHub Pages，以下是详细步骤：

#### 方法一：使用 GitHub Actions 自动部署（推荐）

1. 确保项目中包含 `.github/workflows/deploy.yml` 文件，该文件配置了自动部署流程

2. 在 GitHub 仓库设置中启用 GitHub Pages：
   - 进入仓库 -> Settings -> Pages
   - Source 选择 "GitHub Actions"

3. 在仓库的 Secrets 中添加必要的环境变量：
   - 进入仓库 -> Settings -> Secrets and variables -> Actions
   - 添加以下 Secrets：
     - `VITE_GITHUB_TOKEN`: GitHub API 访问令牌
     - `VITE_GITHUB_OWNER`: GitHub 用户名
     - `VITE_GITHUB_REPO`: 存储脚本的仓库名
     - `VITE_GITHUB_BRANCH`: 分支名（通常是 main）
     - `VITE_PASSWORD_SALT`: 密码加密盐

4. 推送代码到 main 分支，GitHub Actions 将自动构建并部署项目

#### 方法二：手动部署

1. 修改 `vite.config.ts` 文件中的 base 配置，设置为您的仓库名：
```typescript
export default defineConfig({
  // ...其他配置
  base: '/your-repo-name/', // 替换为您的仓库名
  // ...
});
```

2. 构建项目：
```bash
npm run build
# 或使用yarn
yarn build
```

3. 将 `dist` 目录的内容推送到 GitHub 仓库的 `gh-pages` 分支

#### 注意事项

1. **路由配置**：本项目使用 HashRouter 而非 BrowserRouter，以确保在 GitHub Pages 上正常工作。这意味着 URL 会包含 `#` 符号，例如 `https://username.github.io/repo-name/#/upload`。

2. **静态资源路径**：确保所有静态资源引用使用相对路径或 `import.meta.env.BASE_URL` 前缀，避免使用绝对路径（以 `/` 开头）。

3. **自定义域名**：如果您使用自定义域名，请在 `public` 目录中添加 `CNAME` 文件。

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
  { label: '自动化', category: '功能' },
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

上传的脚本将以JSON文件的形式存储在指定的GitHub仓库的`public/script_dist`文件夹中。文件命名使用脚本ID，格式为：`{scriptId}.json`。

JSON文件包含所有脚本信息，包括ID、名称、作者、版本、标签、内容、按钮配置等。

## 特性

### 上传页面的表单预填充功能

脚本市场上传页面支持通过外部系统预填充表单数据，方便从其他系统直接调用并自动填写表单。

查看 `form-prefill-example.html` 文件，了解如何使用预填充功能。

支持以下两种方式：

#### 1. URL参数方式

可以通过URL参数传递JSON数据来预填充表单：

- **使用`json`参数**：适用于较短的数据
  ```
  https://your-site.com/#/upload?json={"id":"script-001","name":"测试脚本","content":"console.log('Hello')"}
  ```

- **使用`data`参数**：适用于较长的数据，使用base64编码
  ```
  https://your-site.com/#/upload?data=eyJpZCI6InNjcmlwdC0wMDEiLCJuYW1lIjoi5rWL6K+V6ISa5pysIiwiY29udGVudCI6ImNvbnNvbGUubG9nKCdIZWxsbycpIn0=
  ```

注意：由于项目使用 HashRouter，URL 中包含 `#` 符号，参数位于哈希部分之后。

#### 2. postMessage API方式

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
iframe.contentWindow.postMessage(scriptData, 'https://your-script-market-url.com/#/upload');
```

#### 支持的字段

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

### 目录页面的动态下载/导入按钮

脚本市场支持根据 URL 参数动态切换"下载"按钮的行为，可以在"直接下载脚本文件"和自定义策略（如"通过 `window.postMessage` 将脚本数据导入到父窗口"）两种模式之间切换。

#### 功能目的

该功能主要用于将脚本市场作为 iframe 嵌入其他应用时，能够直接将脚本导入到宿主应用，而不需要用户手动下载后再上传。

#### 核心实现

该功能的核心逻辑主要由 `src/pages/ScriptMarket/utils/scriptActionHandler.ts` 处理，采用策略模式实现不同的操作行为。如要增添新的操作行为，只需在该文件中添加新的策略函数。

#### 如何触发导入模式

- 通过 URL 参数 `source` 来指定操作目标。例如，`?source=example` 会激活向 Example 导入的模式（如果支持，否则使用默认的下载模式）。

## 技术栈

- React - 用户界面库
- TypeScript - 静态类型检查
- Vite - 构建工具
- Ant Design - UI组件库
- i18next - 国际化
- Octokit - GitHub API客户端
- React Router - 客户端路由（使用 HashRouter 模式）

## 贡献指南

欢迎贡献！请随时提交Issue或Pull Request。

## 许可证

MIT