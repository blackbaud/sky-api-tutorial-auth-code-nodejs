/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var routes;

    routes = {
        api: {}
    };

    routes.auth = require('./auth')();
    routes.api.nxt = require('./api/nxt')();
    routes.api.sky = require('./api/sky')(routes.api.nxt);

    module.exports = routes;
}());