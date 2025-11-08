/**
 * 联系人控制器
 * 处理联系人相关的业务逻辑
 */
import contactModel from '../models/contact.js';
import {
    validateContactData,
    isValidId,
    sanitizeContactData,
    isValidSearchKeyword
} from '../utils/validation.js';
import {
    createValidationError,
    createNotFoundError,
    createConflictError
} from '../middleware/errorHandler.js';

/**
 * 获取所有联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = contactModel.getAllContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

/**
 * 根据ID获取联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 验证ID格式
        if (!isValidId(id)) {
            throw createValidationError(['无效的联系人ID']);
        }
        
        const contact = contactModel.getContactById(id);
        
        if (!contact) {
            throw createNotFoundError('联系人');
        }
        
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

/**
 * 创建新联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const createContact = async (req, res, next) => {
    try {
        // 验证请求体
        const validation = validateContactData(req.body);
        if (!validation.isValid) {
            throw createValidationError(validation.errors);
        }
        
        // 清理数据
        const sanitizedData = sanitizeContactData(req.body);
        
        // 检查电话号码是否已存在
        if (contactModel.isPhoneExists(sanitizedData.phone)) {
            throw createConflictError('该电话号码已存在');
        }
        
        // 创建联系人
        const newContact = contactModel.createContact(sanitizedData);
        
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

/**
 * 更新联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 验证ID格式
        if (!isValidId(id)) {
            throw createValidationError(['无效的联系人ID']);
        }
        
        // 检查联系人是否存在
        const existingContact = contactModel.getContactById(id);
        if (!existingContact) {
            throw createNotFoundError('联系人');
        }
        
        // 验证请求体
        const validation = validateContactData(req.body, true);
        if (!validation.isValid) {
            throw createValidationError(validation.errors);
        }
        
        // 清理数据
        const sanitizedData = sanitizeContactData(req.body);
        
        // 检查电话号码是否已被其他联系人使用
        if (sanitizedData.phone && 
            sanitizedData.phone !== existingContact.phone && 
            contactModel.isPhoneExists(sanitizedData.phone, id)) {
            throw createConflictError('该电话号码已存在');
        }
        
        // 更新联系人
        const updatedContact = contactModel.updateContact(id, sanitizedData);
        
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};

/**
 * 删除联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 验证ID格式
        if (!isValidId(id)) {
            throw createValidationError(['无效的联系人ID']);
        }
        
        // 检查联系人是否存在
        const existingContact = contactModel.getContactById(id);
        if (!existingContact) {
            throw createNotFoundError('联系人');
        }
        
        // 删除联系人
        const success = contactModel.deleteContact(id);
        
        if (success) {
            res.status(200).json({
                success: true,
                message: '联系人删除成功'
            });
        } else {
            throw new Error('删除联系人失败');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * 搜索联系人
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const searchContacts = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        
        // 验证搜索关键词
        if (!isValidSearchKeyword(keyword)) {
            // 如果关键词无效，返回所有联系人
            const contacts = contactModel.getAllContacts();
            return res.status(200).json(contacts);
        }
        
        // 执行搜索
        const searchResults = contactModel.searchContacts(keyword);
        
        res.status(200).json(searchResults);
    } catch (error) {
        next(error);
    }
};

/**
 * 获取联系人统计信息
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export const getContactStats = async (req, res, next) => {
    try {
        const contacts = contactModel.getAllContacts();
        const totalCount = contacts.length;
        
        // 统计有邮箱的联系人数量
        const withEmailCount = contacts.filter(contact => contact.email).length;
        
        res.status(200).json({
            totalCount,
            withEmailCount,
            withoutEmailCount: totalCount - withEmailCount
        });
    } catch (error) {
        next(error);
    }
};