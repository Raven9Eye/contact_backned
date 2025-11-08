/**
 * 验证工具函数
 */

/**
 * 验证是否为有效的手机号码（中国大陆）
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
    // 中国大陆手机号正则表达式
    const phoneRegex = /^1[3-9]\d{9}$/;
    return typeof phone === 'string' && phoneRegex.test(phone);
}

/**
 * 验证是否为有效的电子邮箱
 * @param {string} email - 电子邮箱
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
    if (!email) return true; // 邮箱可选
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

/**
 * 验证联系人数据
 * @param {Object} contactData - 联系人数据
 * @param {boolean} isUpdate - 是否为更新操作
 * @returns {Object} 验证结果 { isValid: boolean, errors: Array }
 */
export function validateContactData(contactData, isUpdate = false) {
    const errors = [];
    
    // 检查是否为对象
    if (!contactData || typeof contactData !== 'object') {
        errors.push('联系人数据必须是有效的对象');
        return { isValid: false, errors };
    }
    
    // 姓名验证
    if (!isUpdate || (isUpdate && 'name' in contactData)) {
        if (!contactData.name || typeof contactData.name !== 'string') {
            errors.push('姓名不能为空且必须是字符串');
        } else if (contactData.name.trim().length === 0) {
            errors.push('姓名不能只包含空白字符');
        } else if (contactData.name.length > 50) {
            errors.push('姓名长度不能超过50个字符');
        }
    }
    
    // 电话号码验证
    if (!isUpdate || (isUpdate && 'phone' in contactData)) {
        if (!contactData.phone || typeof contactData.phone !== 'string') {
            errors.push('电话号码不能为空且必须是字符串');
        } else if (!isValidPhone(contactData.phone)) {
            errors.push('请输入有效的手机号码');
        }
    }
    
    // 邮箱验证（如果提供）
    if ('email' in contactData && contactData.email) {
        if (!isValidEmail(contactData.email)) {
            errors.push('请输入有效的电子邮箱地址');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * 验证ID格式
 * @param {string} id - 要验证的ID
 * @returns {boolean} 是否有效
 */
export function isValidId(id) {
    // UUID v4 格式验证
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // 也接受数字ID（为了兼容示例数据）
    const numberRegex = /^\d+$/;
    
    return typeof id === 'string' && (uuidRegex.test(id) || numberRegex.test(id));
}

/**
 * 清理和标准化联系人数据
 * @param {Object} contactData - 原始联系人数据
 * @returns {Object} 清理后的数据
 */
export function sanitizeContactData(contactData) {
    const sanitized = {};
    
    if (contactData.name) {
        sanitized.name = contactData.name.trim();
    }
    
    if (contactData.phone) {
        sanitized.phone = contactData.phone.trim();
    }
    
    if (contactData.email) {
        const trimmedEmail = contactData.email.trim();
        sanitized.email = trimmedEmail ? trimmedEmail : null;
    } else if ('email' in contactData) {
        sanitized.email = null;
    }
    
    return sanitized;
}

/**
 * 验证搜索关键词
 * @param {string} keyword - 搜索关键词
 * @returns {boolean} 是否有效
 */
export function isValidSearchKeyword(keyword) {
    return typeof keyword === 'string' && keyword.trim().length > 0;
}

/**
 * 创建验证错误响应
 * @param {Array} errors - 错误信息数组
 * @param {number} statusCode - HTTP状态码，默认为400
 * @returns {Object} 错误响应对象
 */
export function createValidationErrorResponse(errors, statusCode = 400) {
    return {
        statusCode,
        error: 'ValidationError',
        message: '输入验证失败',
        details: errors
    };
}