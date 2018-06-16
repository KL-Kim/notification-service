/**
 * Notification service grpc server methods
 *
 * @export {Functions}
 * @version 0.0.1
 *
 * @author KL-Kim (https://github.com/KL-Kim)
 * @license MIT
 */

import Notification from '../models/notification.model'

/**
 * Add new notification
 * @since 0.0.1
 * @property {ObjectId} call.request.userId - Reciever user Id
 * @property {ObjectId} call.request.senderId - Sender user Id
 * @property {String} call.request.type - Notification type
 * @property {String} call.request.event - Notification type event
 * @property {String} call.request.subjectUrl - Subject Url (Id or slug)
 * @property {String} call.request.subjectTitle - Subject Title
 * @property {String} call.request.subjectContent - Subject Content
 * @property {ObjectId} call.request.commentId - Comment Id or Review Id
 * @property {ObjectId} call.request.commentContent - Comment or Review Content
 */
export const addNotification = (call, callback) => {
  const { userId, senderId, type, event, subjectUrl, subjectTitle, subjectContent, commentId, commentContent } = call.request;

  const notification = new Notification({
    userId,
    senderId,
    type,
    event,
    subjectUrl,
    subjectTitle,
    subjectContent,
    commentId,
    commentContent,
  });

  notification.save()
    .then(notification => {
      callback(null, {
        result: 'ok'
      });
    }).catch(err => {
      callback(err);
    });
}
