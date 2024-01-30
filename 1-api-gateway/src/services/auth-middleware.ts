import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@ruldane/jobber-shared';
import { config } from '@gateway/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token not found. Please login again', 'Gateway Service, verifyUser method() user');
    }
    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token not found. Please login again', 'Gateway Service, verifyUser method() user');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new BadRequestError(
        'Not authorized, Authentication is required here... :)',
        'Gateway Service, checkAuthentication method() user'
      );
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
