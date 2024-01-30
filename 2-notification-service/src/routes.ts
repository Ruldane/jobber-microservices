import express, { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export const healthRoutes = (): Router => {
  router.get('/notification-health', (res: Response) => {
    res.status(StatusCodes.OK).send('Notification service is up and running');
  });
  return router;
};
