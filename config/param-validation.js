/**
 * Parameters Validation Config
 *
 * @version 0.0.1
 *
 * @author KL-Kim (https://github.com/KL-Kim)
 * @license MIT
 */
 
import Joi from 'joi';

export default {

	// Get notifications
	"getNotifications": {
		"params": {
			"uid": Joi.string().hex().required(),
			"unRead": Joi.number(),
			"skip": Joi.number(),
			"limit": Joi.number(),
		}
	},

	// Get unread notifications count
	"getUnreadNotificationsCount": {
		"params": {
			"uid": Joi.string().hex().required(),
		}
	},

	// Delete notification
	"deleteNotification": {
		"params": {
			"id": Joi.string().hex().required(),
		}
	},

	// Clear read notifications
	"clearReadNotifications": {
		"params": {
			"uid": Joi.string().hex().required(),
		}
	}
};
