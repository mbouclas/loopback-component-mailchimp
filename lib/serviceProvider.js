module.exports = function (App, options) {
    function ServiceProvider() {
        this.package = {
            name: 'loopbackMailChimp'
        };

    }

    var Model = App.loopback.createModel(require('./Models/MailChimp.json')),
        customizeModel = require('./Models/MailChimp.js');
    customizeModel(Model);
    App.models.MailChimp = Model;

    App.MailChimp = require('./mailchimp')(App,options);
    return new ServiceProvider();
};