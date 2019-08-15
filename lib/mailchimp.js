var Mailchimp = require('mailchimp-api-v3'),
	Promise = require('bluebird'),
	lo = require('lodash'),
	maxmind = require('maxmind'),
	md5 = require('md5');

module.exports = function (App, options) {
	var Chimp = {};

	Chimp.MailChimp = new Mailchimp(options.apiKey);

	//	https://developer.mailchimp.com/documentation/mailchimp/reference/lists/members/tags/
	Chimp.addTags = function(user, tags, listId) {
		var _this = this;
		return new Promise(function(resolve,reject) {

			if( !listId ) {
				listId = options.defaultListId;
			}

			//	add tags to subscriber in expected format
			let body = {
				tags: tags.map(tag => ({name:tag,status:'active'})),
			}

			_this.MailChimp.request({
				method: 'POST',
				path: '/lists/{list_id}/members/{subscriber_hash}/tags',
				path_params: {
					list_id: listId,
					subscriber_hash: md5(user.email.toLowerCase()),
				},
				body: body,
				params: {}
			})
			.then( resolve )
			.catch( reject );
		})
	}

	Chimp.subscribe = function (user, listId) {
		var _this = this;
		return new Promise(function (resolve, reject) {
			if (!user.merge_fields) {
				user.merge_fields = {};
			}

			if (!user.tags) {
				user.tags = [];
			}

			if( !listId ) {
				listId = options.defaultListId;
			}

			var subscriber = {
					email_address: user.email,
					double_optin: (options.defaults && options.defaults.double_optin) || false,
					status: 'subscribed',
					timestamp_opt: new Date().toISOString().replace('T', ' ').replace(/\..*$/g, ''),
					list_id: listId,
					merge_fields: {
						EMAIL: user.email,
						FNAME: user.firstName || null,
						LNAME: user.lastName || null
					}
				},
				updateExistingSubscribers = options.updateIfExists || false,
				subscribeResponse = null;

			if (user.ip) {
				subscriber.ip_opt = user.ip;
				subscriber.merge_fields.optin_ip = user.ip;
			}

			subscriber.merge_fields = lo.merge(subscriber.merge_fields, user.merge_fields);
			
			let tags = ((options.defaults && options.defaults.tags) || [])
				.concat(user.tags || []);

			_this.MailChimp.request({
				method: updateExistingSubscribers ? 'PUT' : 'POST',
				path: updateExistingSubscribers ? 
					'/lists/{list_id}/members/{subscriber_hash}' : 
					'/lists/{list_id}/members',
				path_params: {
					list_id: listId,
					subscriber_hash: md5(user.email.toLowerCase()),
				},
				body: subscriber,
				params: {}
			})
			.then( response => {
				subscribeResponse = response;
				return (tags && tags.length) ? 
					_this.addTags(user,tags,listId) : 
					Promise.resolve();
			})
			.then( () => resolve(subscribeResponse) )
			.catch( reject );
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
					list_id: listId || options.defaultListId,
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
					list_id: listId || options.defaultListId,
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
