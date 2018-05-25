/**
 * Notification GRPC Serivce methods
 */
import Notification from '../models/notification.model'

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
