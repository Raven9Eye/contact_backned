/**
 * 错误处理中间件
 */

/**
 * 标准化错误响应
 * @param {Error} err - 错误对象
 * @param {number} statusCode - HTTP状态码
 * @returns {Object} 标准化的错误响应
 */
function standardizeError(err, statusCode = 500) {
    // 开发环境显示详细错误信息
    const isDev = process.env.NODE_ENV === 'development';
    
    return {
        statusCode,
        error: err.name || 'Error',
        message: err.message || '服务器内部错误',
        ...(isDev && err.stack ? { stack: err.stack.split('\n') } : {})
    };
}

/**
 * 404 错误处理中间件
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export function notFoundHandler(req, res, next) {
    const error = new Error(`请求的资源 ${req.originalUrl} 不存在`);
    error.name = 'NotFoundError';
    res.status(404);
    next(error);
}

/**
 * 通用错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export function errorHandler(err, req, res, next) {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // 根据错误类型设置状态码
    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            break;
        case 'NotFoundError':
            statusCode = 404;
            break;
        case 'UnauthorizedError':
            statusCode = 401;
            break;
        case 'ForbiddenError':
            statusCode = 403;
            break;
        case 'ConflictError':
            statusCode = 409;
            break;
        default:
            // 保持原有状态码或使用500
            break;
    }
    
    // 创建标准化错误响应
    const errorResponse = standardizeError(err, statusCode);
    
    // 记录错误日志
    console.error(`[${statusCode}] ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    
    // 发送JSON错误响应
    res.status(statusCode).json({
        error: errorResponse.error,
        message: errorResponse.message,
        ...(errorResponse.details ? { details: errorResponse.details } : {}),
        ...(errorResponse.stack ? { stack: errorResponse.stack } : {})
    });
}

/**
 * 请求验证错误处理
 * @param {Error} err - 验证错误对象
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {NextFunction} next - Express下一个中间件函数
 */
export function validationErrorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
        // 如果是自定义的验证错误，包含details
        if (err.details) {
            res.status(400).json({
                error: 'ValidationError',
                message: '输入验证失败',
                details: err.details
            });
        } else {
            res.status(400).json({
                error: 'ValidationError',
                message: err.message || '输入验证失败'
            });
        }
    } else {
        next(err);
    }
}

/**
 * 异步错误捕获包装器
 * 用于捕获异步路由处理函数中的错误
 * @param {Function} fn - 异步路由处理函数
 * @returns {Function} 包装后的处理函数
 */
export function asyncErrorHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 创建自定义错误类
 * @param {string} name - 错误名称
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @param {Array} details - 错误详情
 * @returns {Error} 自定义错误对象
 */
export function createError(name, message, statusCode = 500, details = []) {
    const error = new Error(message);
    error.name = name;
    error.statusCode = statusCode;
    if (details.length > 0) {
        error.details = details;
    }
    return error;
}

// 预定义的错误创建函数
export function createValidationError(details) {
    return createError('ValidationError', '输入验证失败', 400, details);
}

export function createNotFoundError(resource = '资源') {
    return createError('NotFoundError', `${resource}不存在`, 404);
}

export function createConflictError(message = '资源冲突') {
    return createError('ConflictError', message, 409);
}

export function createUnauthorizedError(message = '未授权访问') {
    return createError('UnauthorizedError', message, 401);
}

export function createForbiddenError(message = '禁止访问') {
    return createError('ForbiddenError', message, 403);
}