
import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { UserRepository } from '../../../repository/UserRepository';

export async function AuthenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userRepository = new UserRepository();
    let token = req.header('Authorization');
    const decoded = verify(token, process.env.JWT_HASH);
    const user = await userRepository.findOne({ _id: decoded.id, token });
    if (!user) {
      return next({
        message: `Invalid request: User is not authenticated`,
        code: 401
      });
    }
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next({
        message: `Authentication failed: the token has expired, try logging in again.`,
        code: 401
      });
    }
    return next({
      message: `Authentication failed: ${err.message}`,
      code: 401
    });
  }
}

export function AuthenticateSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  if (token === process.env.ADMIN_MIDDLEWARE_KEY) {
    return next();
  }
  return res.status(401).send('https://www.youtube.com/watch?v=3xYXUeSmb-Y');
}  
  