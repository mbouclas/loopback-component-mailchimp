## loopback-connector-mailchimp

Loopback connector module which allow to send emails via Mailchimp.

## 1. Installation

````
npm install loopback-component-mailchimp --save
````

## 2. Configuration

Add the following to component-config.json:

    {
        "loopback-component-mailchimp": {
            "apiKey": "[your api key here]",
            "defaultListId": "[a default listId]",
            "updateIfExists": true,
            "defaults": {
              "double_optin" : true
            }
        }
    }
    
### Config Properties

| Property | Description |
| ----------- | ----------- |
| apiKey | MailChimp API key (required) |
| defaultListId | The ID of the destination list to subscribe/unsubscribes users to/from, if unspecified in calls to subscribe/unsubscribe (optional)       |
| updateIfExists | Whether to update users if they already exist in the list (optional, defaults to false)       |
| defaults | Optional parameters to pass with subscribe; supported properties are `double_optin` (boolean, defaults to `false`) and `tags` (array, defaults to `null`)

## 3. Use

Subscribe a member. Required properties are `email`, `firstName` and `lastName`. Optional properties are `tags` and `merge_fields`. Returns a Promise:

    var user = {
        email: 'user@email.com',
        firstName: 'A name',
        lastName: 'A surname',
        tags: ['[a tag]'],
        merge_fields: {
            optin_ip: '192.168.0.1'
        }
    }

    app.MailChimp.subscribe(user, listId)
        .then(function (res) {
            console.log('Result :', res);
        })
        .catch(function (err) {
            console.log('Error : ', err);
        });

Simple unsubscribe member. Returns a Promise:

    var user = {
        email: 'user@email.com'
    }

    app.MailChimp.unsubscribe(user, listId)
        .then(function (res) {
            console.log('Result :', res);
        })
        .catch(function (err) {
            console.log('Error : ', err);
        });

Add tags for a subscribed member. Returns a Promise:

    var user = {
        email: 'user@email.com'
    }
    
    var tags = {
        'user'
    }

    app.MailChimp.addTags(user, tags, listId)
        .then(function (res) {
            console.log('Result :', res);
        })
        .catch(function (err) {
            console.log('Error : ', err);
        });