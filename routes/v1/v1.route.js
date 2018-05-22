import Express from 'express';
import notificationRoute from './notification.route';

const router = Express.Router();

router.use('/notification', notificationRoute);

export default router;
