/**
 * 服务器入口文件
 * 配置和启动Express服务器
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 配置端口
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// 配置CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// 应用中间件
app.use(cors(corsOptions));
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: '服务器运行正常',
        timestamp: new Date().toISOString()
    });
});

// API路由
app.use('/api/contacts', contactRoutes);

// 根路径响应
app.get('/', (req, res) => {
    res.status(200).json({
        message: '通讯录API服务',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            contacts: '/api/contacts',
            search: '/api/contacts/search?keyword=关键词'
        }
    });
});

// 404错误处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, HOST, () => {
    console.log(`\n🚀 服务器启动成功！`);
    console.log(`📡 监听地址: http://${HOST}:${PORT}`);
    console.log(`🔍 健康检查: http://${HOST}:${PORT}/health`);
    console.log(`📚 API文档: http://${HOST}:${PORT}/`);
    console.log(`\n环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`─────────────────────────────────────`);
});

// 优雅关闭处理
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    // 在这里可以添加清理逻辑，如关闭数据库连接
    setTimeout(() => {
        console.log('服务器已关闭');
        process.exit(0);
    }, 500);
});

process.on('SIGTERM', () => {
    console.log('\n收到终止信号，正在关闭服务器...');
    setTimeout(() => {
        console.log('服务器已关闭');
        process.exit(0);
    }, 500);
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
    console.error('未捕获异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});