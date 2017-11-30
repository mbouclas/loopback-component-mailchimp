## loopback-connector-mailchimp

Loopback connector module which allow to send emails via Mailchimp.

## 1. Installation

````
npm install loopback-component-mailchimp --save
````

## 2. Configuration

component-config.json

    {
        "loopback-component-mailchimp": {
            "connector": "loopback-connector-mailgun",
            "apikey": "[your api key here]",
            "defaultListId": "[a default listId]",
            "defaults": {
              "double_optin" : true
            }
        }
    }

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

    app.MailChimp.subscribe(user, defaultListId)
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

    app.MailChimp.unsubscribe(user, defaultListId)
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

    app.MailChimp.delete(user, defaultListId)
        .then(function (res) {
            console.log('Result :', res);
        })
        .catch(function (err) {
            console.log('Error : ', err);
        });