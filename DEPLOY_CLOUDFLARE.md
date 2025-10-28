# DecoTV - Cloudflare Pages 部署指南

本指南提供了如何将 DecoTV 项目部署到 Cloudflare Pages 平台的详细步骤，确保部署过程顺利且配置正确。

## 环境准备

### 1. Cloudflare 账户
- 确保您拥有一个 Cloudflare 账户
- 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)

### 2. GitHub/GitLab 仓库
- 将项目代码推送到 GitHub 或 GitLab 仓库
- 确保仓库包含了所有必要的文件，特别是配置文件

### 3. 数据库服务（可选但推荐）
如果需要用户数据持久化和同步功能，建议配置以下服务之一：
- **Upstash Redis**（推荐，对 Cloudflare Pages 友好）
- **其他 Redis 兼容服务**

## 配置文件说明

项目中已包含以下 Cloudflare Pages 配置文件：

### `_headers`
定义 HTTP 响应头，包括：
- CORS 配置（允许跨域请求）
- 安全响应头（X-Content-Type-Options, X-Frame-Options, X-XSS-Protection 等）
- 静态资源缓存控制（JS, CSS, 图片等资源的缓存策略）
- 字体文件缓存控制

### `_redirects`
定义 URL 重定向规则，支持：
- 代理路径处理 `/proxy/*`
- SPA 路由回退（所有未匹配路径指向 index.html）

### `wrangler.toml`
Wrangler 配置文件，用于本地开发和部署配置：
- 项目名称和兼容性设置
- 全局环境变量默认值
- 生产和开发环境特定配置

## 部署步骤

### 1. 创建 Cloudflare Pages 项目

1. 在 Cloudflare Dashboard 中，选择 **Pages**
2. 点击 **连接到 Git**
3. 选择您的 GitHub/GitLab 仓库
4. 点击 **开始设置**

### 2. 配置构建和部署设置

**构建设置：**
- 框架预设：`Next.js`
- 构建命令：`pnpm run cloudflare-build`
- 构建输出目录：`out`
- 根目录：`.`（根目录）

### 3. 配置环境变量

在 **环境变量** 部分，根据环境需要添加以下环境变量：

| 环境变量 | 类型 | 描述 | 是否必须 | 默认值 |
|---------|------|------|---------|--------|
| `NEXT_PUBLIC_STORAGE_TYPE` | 文本 | 存储类型 (localstorage/redis/upstash/kvrocks) | 推荐 | `localstorage` |
| `UPSTASH_REDIS_REST_URL` | 文本 | Upstash Redis 实例 URL | 使用 upstash 时必须 | - |
| `UPSTASH_REDIS_REST_TOKEN` | 文本 | Upstash Redis 访问令牌 | 使用 upstash 时必须 | - |
| `REDIS_URL` | 文本 | Redis 连接 URL | 使用 redis 时必须 | - |
| `ADMIN_PASSWORD` | 文本 | 管理员密码 | 可选 | - |
| `NEXT_PUBLIC_ENABLE_REGISTRATION` | 文本 | 是否启用用户注册 (true/false) | 可选 | `false` |
| `DOUBAN_API_KEY` | 文本 | 豆瓣 API 密钥 | 可选 | - |
| `TMDB_API_KEY` | 文本 | TMDB API 密钥 | 可选 | - |
| `DEBUG` | 文本 | 调试模式 (true/false) | 可选 | `false` |

### 4. 配置完成后部署

1. 点击 **保存并部署** 开始部署过程
2. Cloudflare Pages 将自动克隆仓库、安装依赖并构建项目
3. 部署完成后，您将获得一个唯一的 `.pages.dev` 域名

## 部署后配置

### 1. 首次访问

- 访问部署后的 URL (your-project-name.pages.dev)
- 系统会提示您配置播放源和直播源
- 您可以使用管理员功能（如果设置了 ADMIN_PASSWORD）来管理配置

### 2. 自定义域名（可选）

如果需要使用自定义域名：

1. 在 Cloudflare Pages 项目设置中，找到 **自定义域**
2. 点击 **设置自定义域** 并按照提示完成域名设置
3. 确保您的域名 DNS 记录已指向 Cloudflare

## 常见问题与故障排除

### 构建失败

- **依赖问题**：确保 `package.json` 中的依赖正确，特别是 `next`, `react`, `react-dom` 版本兼容
- **内存限制**：如果构建失败并显示内存不足，可以尝试在环境变量中设置 `NODE_OPTIONS=--max-old-space-size=4096`

### 运行时错误

- **存储连接问题**：检查 Redis/Upstash 连接字符串和令牌是否正确
- **API 代理错误**：确保代理路径配置正确，检查 `_redirects` 文件中的代理规则
- **权限问题**：如果使用 Upstash，确保访问令牌具有正确的权限

### 缓存问题

- Cloudflare Pages 会自动缓存静态资源
- 如果需要清除缓存，您可以在部署历史中重新部署或使用 **清除缓存** 功能

## 性能优化建议

1. **使用 Upstash Redis**：Upstash 与 Cloudflare Pages 配合良好，延迟低
2. **优化资源加载**：使用适当的缓存策略，确保静态资源被正确缓存
3. **启用 Brotli 压缩**：Cloudflare 默认提供 Brotli 压缩，确保开启
4. **配置边缘缓存**：合理设置缓存规则，减少源站请求

## 注意事项

1. **数据隐私**：确保遵守数据隐私法规，特别是用户数据存储和处理
2. **内容合规**：请确保您部署的内容符合当地法律法规
3. **定期更新**：定期更新项目代码和依赖，确保安全性和功能最新
4. **监控使用情况**：监控 Cloudflare Pages 的使用情况，确保不超出免费配额

## 扩展功能

如果您需要扩展 DecoTV 的功能，可以考虑：

1. **添加自定义 API 路由**：在 `src/app/api` 目录下创建新的路由
2. **集成更多数据源**：配置更多播放源和直播源
3. **开发自定义组件**：扩展 UI 功能和用户体验

## 支持与反馈

如果您在部署过程中遇到问题，可以：

1. 检查项目的 GitHub Issues 页面
2. 查阅 Cloudflare Pages 官方文档
3. 联系 Cloudflare 支持团队获取帮助

祝您部署顺利！