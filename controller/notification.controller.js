import Promise from 'bluebird';
import _ from 'lodash';
import httpStatus from 'http-status';
import passport from 'passport';

import grants from '../config/rbac.config';
import BaseController from './base.controller';
import APIError from '../helper/api-error';
import Notification from '../models/notification.model';

class NotificationController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get notification list by user
   * @property {ObjectId} req.params.uid - User id
   * @property {Number} req.query.unRead - Notification is read or not
   * @property {Number} req.query.skip - Number of skip
   * @property {Number} req.query.limit - Notification list limit
   */
  getNotifications(req, res, next) {
    NotificationController.authenticate(req, res, next)
      .then(payload => {
        if (payload.uid !== req.params.uid) throw new APIError("Forbidden", httpStatus.FORBIDDEN);

        return Notification.getCountByUserId(req.params.uid);
      })
      .then(count => {
        req.totalCount = count;

        return Notification.getCountByUserId(req.params.uid, true);
      })
      .then(count => {
        req.unreadCount = count;

        return Notification.getListByUserId(req.params.uid, {
          unRead: req.query.unRead,
          skip: req.query.skip,
          limit: req.query.limit,
        });
      })
      .then(list => {
        req.list = [];

        var promises = [];

        list.map(item => {
          req.list.push(Object.assign({}, item.toJSON()));
          item.isRead = true;
          promises.push(new Promise((resolve, reject) => {
            resolve(item.save());
          }));
        });

        return Promise.all(promises);
      })
      .then(list => {
        return res.json({
          totalCount: req.totalCount,
          unreadCount: req.unreadCount,
          list: req.list,
        });
      })
      .catch(err => {
        return next(err);
      });
  }

  /**
   * Get unread notifications count
   * @property {ObjectId} req.params.uid - User id
   */
  getUnreadNotificationsCount(req, res, next) {
    NotificationController.authenticate(req, res, next)
      .then(payload => {
        if (payload.uid !== req.params.uid) throw new APIError("Forbidden", httpStatus.FORBIDDEN);

        return Notification.getCountByUserId(req.params.uid, true);
      })
      .then(count => {
        res.json({
          count
        });
      })
      .catch(err => {
        return next(err);
      });
  }

  /**
   * Delete notification
   * @property {ObjectId} req.params.id - Notification id
   */
  deleteNotification(req, res, next) {
    NotificationController.authenticate(req, res, next)
      .then(payload => {
        req.uid = payload.uid;

        return Notification.getById(req.params.id);
      })
      .then(notification => {
        if (_.isEmpty(notification)) throw new APIError("Not found", httpStatus.NOT_FOUND);
        if (req.uid.toString() !== notification.userId.toString()) throw new APIError("Forbidden", httpStatus.FORBIDDEN);

        return notification.remove();
      })
      .then(result => {
        return Notification.getCountByUserId(req.uid);
      })
      .then(count => {
        req.totalCount = count;

        return Notification.getCountByUserId(req.uid, true);
      })
      .then(unreadCount => {
        return res.json({
          totalCount: req.count,
          unreadCount,
        });
      })
      .catch(err => {
        return next(err);
      });
  }

  /**
   * Clear read notifications
   * @property {ObjectId} req.params.uid - User id
   */
  clearReadNotifications(req, res, next) {
    NotificationController.authenticate(req, res, next)
      .then(payload => {
        if (payload.uid !== req.params.uid) throw new APIError("Forbidden", httpStatus.FORBIDDEN);

        return Notification.remove({ "$and": [{ userId: req.params.uid }, { isRead: true }] });
      })
      .then(result => {
        return Notification.getCountByUserId(req.params.uid);
      })
      .then(count => {
        req.count = count;

        return Notification.getListByUserId(req.params.uid);
      })
      .then(list => {
        return res.json({
          totalCount: req.count,
          unreadCount: req.count,
          list: list,
        });
      })
      .catch(err => {
        return next(err);
      });
  }

  /**
  * Authenticate
  */
  static authenticate(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('access-token', (err, payload, info) => {
        if (err) return reject(err);
        if (info) return reject(new APIError(info.message, httpStatus.UNAUTHORIZED));

        return resolve(payload);
      })(req, res, next);
    });
  }
}

export default NotificationController;
