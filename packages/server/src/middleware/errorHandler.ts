import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: error.details?.map((detail: any) => detail.message) || [error.message]
    });
  }

  if (error.name === 'UnauthorizedError' || error.message === 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: '数据已存在'
    });
  }

  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
}