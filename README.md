# Code Snippet Manager

一个现代化的代码片段管理工具，帮助开发者存储、组织和分享代码片段。使用 Vue 3 和 Express 构建，支持语法高亮和深色模式。

## 功能特点

- 💻 代码片段管理：创建、编辑、删除和查看代码片段
- 🎨 语法高亮：支持多种编程语言的代码高亮显示
- 🌓 深色模式：支持日间/夜间主题切换，自动适应系统主题
- 📱 响应式设计：完美适配桌面和移动设备
- 🏷️ 标签管理：使用标签组织和分类代码片段
- 📋 一键复制：快速复制代码片段到剪贴板

## 技术栈

### 前端
- Vue 3
- Vue Router
- Pinia (状态管理)
- Highlight.js (代码高亮)
- Axios (HTTP 客户端)

### 后端
- Node.js
- Express
- MongoDB
- Mongoose

## 快速开始

### 前置要求

- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd code-snippet-manager
```

2. 安装后端依赖
```bash
cd backend
npm install
```

3. 安装前端依赖
```bash
cd frontend/vue-code-storage
npm install
```

4. 配置环境变量
```bash
# 在 backend 目录创建 .env 文件
MONGODB_URI=mongodb://localhost:27017/code-snippets
PORT=9000
```

5. 启动开发服务器

后端：
```bash
cd backend
node server.js
```

前端：
```bash
cd frontend/vue-code-storage
npm run dev
```

访问 `http://localhost:5174` 即可使用应用。

## 使用指南

### 创建代码片段

1. 点击首页的 "New Snippet" 按钮
2. 填写代码片段的标题和描述
3. 选择编程语言
4. 输入或粘贴代码
5. 添加相关标签（用逗号分隔）
6. 点击 "Save" 保存

### 管理代码片段

- 查看：点击代码片段卡片查看详情
- 编辑：点击代码片段的 "Edit" 按钮
- 删除：点击代码片段的 "Delete" 按钮
- 复制：在详情页面点击 "Copy Code" 按钮

### 主题切换

- 点击导航栏右侧的主题切换按钮切换日间/夜间模式
- 主题设置会自动保存到本地
- 首次访问时会自动适应系统主题设置

## 项目结构

```
code-snippet-manager/
├── backend/               # 后端代码
│   ├── models/           # 数据模型
│   ├── routes/           # 路由处理
│   └── server.js         # 服务器入口
│
└── frontend/             # 前端代码
    └── vue-code-storage/
        ├── src/
        │   ├── components/   # Vue 组件
        │   ├── views/       # 页面组件
        │   ├── stores/      # Pinia 状态
        │   ├── config/      # 配置文件
        │   └── router/      # 路由配置
        └── public/          # 静态资源
```

## 开发计划

- [ ] 搜索功能
- [ ] 代码片段分享功能
- [ ] 用户认证
- [ ] 代码片段版本控制
- [ ] 更多语言支持

## 贡献指南

欢迎提交 Pull Request 或创建 Issue！

## 许可证

MIT License

# 启动单机 MongoDB 实例
mongod --dbpath /data/db --port 27017

# 常用参数
--dbpath    # 指定数据存储目录
--port      # 指定监听端口(默认27017)
--fork      # 以守护进程方式运行
--logpath   # 指定日志文件路径
--bind_ip   # 指定绑定IP(默认localhost)

```
curl -fsSL https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_mac_id_modifier.sh | sudo bash
```