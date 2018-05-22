/**
 * Parameters Validation Config
 * @export {Object}
 * @version 0.0.1
 */
import Joi from 'joi';

export default {

	// Get notifications
	"getNotifications": {
		"params": {
			"uid": Joi.string().hex().required(),
			"unRead": Joi.number(),
			"limit": Joi.number(),
		}
	},

	// Get new notifications count
	"getNewNotificationsCount": {
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
};
