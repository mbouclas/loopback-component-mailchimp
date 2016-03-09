## loopback-connector-mailchimp

Loopback connector module which allow to send emails via Mailgun.

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

      app.MailChimp.subscribe({
        email : 'user@email.com',
        id : defaultListId,
        firstName : 'A name',
        lastName : 'A surname',
        merge_vars : {
          optin_ip : '192.168.0.1'
        }
      })
        .then(function (res) {
          console.log('Result :',res);
        })
        .catch(function (err) {
        console.log('Error : ',err);
      });
