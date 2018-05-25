import Express from 'express';
import validate from 'express-validation';

import paramValidation from '../../config/param-validation';
import NotificationController from '../../controller/notification.controller';

const router = Express.Router();
const notificationController = new NotificationController();

/** GET /api/v1/notification/:uid - Get notifications **/
router.get("/:uid", validate(paramValidation.getNotifications), notificationController.getNotifications);

/** Get /api/v1/notification/news/:uid - Get unread notifications count **/
router.get("/news/:uid", validate(paramValidation.getUnreadNotificationsCount), notificationController.getUnreadNotificationsCount);

/** DELETE /api/v1/notification/:id - Delete notification **/
router.delete("/:id", validate(paramValidation.deleteNotification), notificationController.deleteNotification);

/** DELETE /api/v1/notification/clear - Delete read notifications **/
router.delete("/clear/:uid", validate(paramValidation.clearReadNotifications), notificationController.clearReadNotifications);

export default router;
