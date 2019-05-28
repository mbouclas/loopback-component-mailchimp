var Mailchimp = require('mailchimp-api-v3'),
	Promise = require('bluebird'),
	lo = require('lodash'),
	maxmind = require('maxmind');
md5 = require("md5");

module.exports = function (App, defaults) {
	var Chimp = {};

	Chimp.MailChimp = new Mailchimp(defaults.apikey);

	Chimp.subscribe = function (user, listId) {
		var _this = this;
		return new Promise(function (resolve, reject) {
			if (!user.merge_fields) {
				user.merge_fields = {};
			}

			var settings = defaults,
				subscriber = {
					email_address: user.email,
					double_optin: defaults.double_optin || false,
					status: 'subscribed',
					timestamp_opt: new Date().toISOString().replace('T', ' ').replace(/\..*$/g, ''),
					list_id: listId || defaults.defaultListId,
					merge_fields: {
						EMAIL: user.email,
						FNAME: user.firstName || null,
						LNAME: user.lastName || null
					}
				};

			if (user.ip) {
				subscriber.ip_opt = user.ip;
				subscriber.merge_fields.optin_ip = user.ip;
			}

			subscriber.merge_fields = lo.merge(subscriber.merge_fields, user.merge_fields);

			_this.MailChimp.request({
				method: 'POST',
				path: '/lists/{list_id}/members',
				path_params: {
					list_id: listId || defaults.defaultListId
				},
				body: subscriber,
				params: {}
			}, function (err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	};

	Chimp.unsubscribe = function (user, listId) {
		var _this = this;
		return new Promise(function (resolve, reject) {
			if (!user.email) {
				return reject(new Error("Email is required to unsubscribe."));
			}

			_this.MailChimp.request({
				method: 'PATCH',
				path: '/lists/{list_id}/members/{member_id}',
				path_params: {
					list_id: listId || defaults.defaultListId,
					member_id: md5(user.email.toLowerCase())
				},
				body: {
					"status": "unsubscribed"
				},
				params: {}
			}, function (err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	Chimp.delete = function (user, listId) {
		var _this = this;
		return new Promise(function (resolve, reject) {
			if (!user.email) {
				return reject(new Error("Email is required to delete."));
			}

			_this.MailChimp.request({
				method: 'DELETE',
				path: '/lists/{list_id}/members/{member_id}',
				path_params: {
					list_id: listId || defaults.defaultListId,
					member_id: md5(user.email.toLowerCase())
				},
				params: {}
			}, function (err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	return Chimp;
};
