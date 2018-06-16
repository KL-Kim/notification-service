/**
 * Notification Model
 *
 * @version 0.0.1
 *
 * @author KL-Kim (https://github.com/KL-Kim)
 * @license MIT
 */

import Promise from 'bluebird';
import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import _ from 'lodash';

import config from '../config/config';
import APIError from '../helper/api-error';

const userDB = mongoose.createConnection(config.userMongo.host + ':' + config.userMongo.port + '/' + config.userMongo.name);
const User = userDB.model('User', {});

const NotificationSchema = new Schema({
  "userId": {
    type: Schema.Types.ObjectId,
    required: true,
  },
  "senderId": {
    type: Schema.Types.ObjectId,
    'ref': 'User',
  },
  "type": {
    type: String,
    required: true,
    enum: ['BUSINESS', 'REVIEW', 'COMMENT', 'USER', 'OTHER'],
  },
  "event": {
    type: String,
    required: true,
    enum: ['START_EVENT', 'UPVOTE', 'CANCEL_UPVOTE', 'DOWNVOTE', 'CANCEL_DOWNVOTE', 'REPLY','FOLLOW', 'UNFOLLOW', 'OTHER']
  },
  "subjectTitle": {
    type: String,
  },
  "subjectContent": {
    type: String,
  },
  "subjectUrl": {
    type: String,
    required: true,
  },
  "commentId": {
    type: Schema.Types.ObjectId,
    required: true,
  },
  "commentContent": {
    type: String,
  },
  "isRead": {
    type: Boolean,
    default: false,
  },
  "createdAt": {
    type: Date,
    default: Date.now
  },
});

/**
 * Index
 */
NotificationSchema.index({
  "userId": 1,
});

/**
 * Virtuals
 */
NotificationSchema.virtual('id')
 	.get(function() { return this._id });

/**
 * Methods
 */
NotificationSchema.methods = {
  /**
	 * Remove unnecessary info
	 */
  toJSON() {
		let obj = this.toObject();
		delete obj.__v;
		return obj;
	},
};

/**
 * Statics
 */
NotificationSchema.statics = {
  /**
   * Get notification by id
   * @param {String} id - Notification id
   */
  getById(id) {
    return this.findById(id).exec();
  },

  /**
   * Get notification list
   * @param {ObjectId} userId - User id
   * @param {Boolean} unRead - Notification is read or not
   */
  getListByUserId(userId, { unRead = false, limit = 10, skip = 0 } = {}) {
    if (_.isEmpty(userId)) throw new APIError("User Id missing", httpStatus.BAD_REQUEST);

    let readCondition;

    if (unRead) {
      readCondition = {
        isRead: false
      };
    }

    return this.find({
      "$and": [
        {
          "userId": userId
        },
        _.isEmpty(readCondition) ? {} : readCondition,
      ]
    })
    .sort({ "createdAt": -1 })
    .skip(+skip)
    .limit(+limit)
    .populate({
      path: 'senderId',
      select: ['username', 'firstName', 'lastName'],
      model: User,
    })
    .exec();
  },

  /**
   * Get notification list count
   * @param {ObjectId} userId - User id
   * @param {Boolean} unRead - Notification is read or not
   */
  getCountByUserId(userId, unRead) {
    let readCondition;

    if (unRead) {
      readCondition = {
        isRead: false
      };
    }

    return this.count({
      "$and": [
        {
          "userId": userId
        },
        _.isEmpty(readCondition) ? {} : readCondition,
      ]
    }).exec();
  }
};

export default mongoose.model('Notification', NotificationSchema);
