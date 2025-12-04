# 幸运星大人的前端项目

## 项目介绍

这是一个使用Vue.js构建的前端项目，包含话题列表、话题详情、登录等功能。

## 技术栈

- Vue 3
- Vue Router
- Vite
- Axios

## 部署说明

本项目已配置GitHub Pages部署功能，可通过以下步骤部署：

1. 安装依赖
```bash
npm install
```

2. 构建项目
```bash
npm run build
```

3. 部署到GitHub Pages
```bash
npm run deploy
```

## 本地运行

```bash
npm run dev
```# 幸运星大人的前端项目

## 项目简介
这是一个基于 Vue 3 + Vite 构建的前端项目，用于展示和实现「幸运星大人」相关的功能。

## 技术栈
- **框架**: Vue 3
- **构建工具**: Vite
- **路由**: Vue Router
- **状态管理**: Pinia
- **HTTP请求**: Axios
- **图标库**: React Icons
- **UUID生成**: UUID

## 项目结构
```
├── public/           # 静态资源目录
├── src/
│   ├── assets/       # 项目资源文件
│   ├── components/   # Vue组件
│   ├── router/       # 路由配置
│   ├── store/        # 状态管理
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   ├── main.js       # 项目入口
│   └── style.css     # 全局样式
├── index.html        # HTML模板
├── package.json      # 项目依赖
└── vite.config.js    # Vite配置
```

## 安装和运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 开发说明
- 使用 Vue 3 的 `<script setup>` 语法编写组件
- 使用 Vue Router 进行页面路由管理
- 使用 Pinia 进行状态管理
- 使用 Axios 进行 API 请求

## 许可证
ISC
