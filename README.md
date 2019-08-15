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
| defaults | Optional parameters to pass with subscribe (optional); supported properties are `double_optin` (defaults to `false`)

## 3. Use

Simple subscribe member. Returns a Promise

    var user = {
        email: 'user@email.com',
        firstName: 'A name',
        lastName: 'A surname',
        merge_vars: {
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

Simple unsubscribe member. Returns a Promise

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