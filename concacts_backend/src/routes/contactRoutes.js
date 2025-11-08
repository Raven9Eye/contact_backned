/**
 * 联系人路由配置
 * 定义所有联系人相关的API端点
 */
import express from 'express';
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    getContactStats
} from '../controllers/contactController.js';
import { asyncErrorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * 联系人路由定义
 */

// 获取所有联系人
// GET /api/contacts
router.get('/', asyncErrorHandler(getAllContacts));

// 获取联系人统计信息
// GET /api/contacts/stats
router.get('/stats', asyncErrorHandler(getContactStats));

// 搜索联系人
// GET /api/contacts/search?keyword=关键词
router.get('/search', asyncErrorHandler(searchContacts));

// 根据ID获取单个联系人
// GET /api/contacts/:id
router.get('/:id', asyncErrorHandler(getContactById));

// 创建新联系人
// POST /api/contacts
router.post('/', asyncErrorHandler(createContact));

// 更新联系人
// PUT /api/contacts/:id
router.put('/:id', asyncErrorHandler(updateContact));

// 删除联系人
// DELETE /api/contacts/:id
router.delete('/:id', asyncErrorHandler(deleteContact));

export default router;