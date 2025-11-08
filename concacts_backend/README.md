# 通讯录后端项目

本项目为 EE308 First assignment-- front-end and back-end separation contacts programming —— “联系人管理（Contacts）” 前端部分。

姓名：ZhiKai Zhang
学号：832301205/23126469
项目目标：实现一个联系人管理界面，包含联系人信息展示、添加、编辑和删除等功能。

## 功能特性

- 联系人的增删改查功能
- RESTful API接口
- 数据存储在内存中（可扩展为数据库）
- 基本的错误处理和输入验证

## 目录结构

```
|- src/
|  |- server.js          # 服务器入口
|  |- routes/
|  |  |- contactRoutes.js # 联系人路由
|  |- controllers/
|  |  |- contactController.js # 联系人控制器
|  |- models/
|  |  |- contact.js      # 联系人模型
|  |- utils/
|  |  |- validation.js   # 验证工具
|  |- middleware/
|  |  |- errorHandler.js # 错误处理中间件
|- package.json
|- README.md
|- codestyle.md
|- .env.example
```

## 技术栈

- Node.js
- Express.js
- UUID (用于生成唯一ID)
- CORS (处理跨域请求)

## 快速开始

1. 安装依赖
   ```bash
   npm install
   ```

2. 启动服务器
   ```bash
   npm start
   ```

3. 服务器将在 http://localhost:3000 启动

## API 接口

### 获取所有联系人
- **GET** `/api/contacts`
- **返回**: 联系人列表数组

### 获取单个联系人
- **GET** `/api/contacts/:id`
- **参数**: `id` - 联系人ID
- **返回**: 单个联系人对象

### 添加联系人
- **POST** `/api/contacts`
- **请求体**: `{"name": "姓名", "phone": "电话号码", "email": "邮箱地址"}`
- **返回**: 创建的联系人对象

### 更新联系人
- **PUT** `/api/contacts/:id`
- **参数**: `id` - 联系人ID
- **请求体**: `{"name": "新姓名", "phone": "新电话号码", "email": "新邮箱地址"}`
- **返回**: 更新后的联系人对象

### 删除联系人
- **DELETE** `/api/contacts/:id`
- **参数**: `id` - 联系人ID
- **返回**: `{"success": true, "message": "删除成功"}`

### 搜索联系人
- **GET** `/api/contacts/search?keyword=关键词`
- **参数**: `keyword` - 搜索关键词
- **返回**: 匹配的联系人列表数组
