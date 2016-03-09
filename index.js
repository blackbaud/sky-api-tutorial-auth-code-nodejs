/*jslint node: true, es5: true, nomen: true*/
(function () {
    'use strict';

    var app,
        bodyParser,
        express,
        fs,
        https,
        httpsOptions,
        routes,
        session,
        sessionConfig,
        timeout;

    // Require application dependencies.
    fs = require('fs');
    https = require('https');
    routes = require('./server/routes');
    express = require('express');
    session = require('express-session');
    timeout = require('connect-timeout');
    bodyParser = require('body-parser');

    // If deployed in our demo site, we store the sessions using Redis.
    // Locally, we store the sessions in memory.
    sessionConfig = {
        resave: false,
        saveUninitialized: true,
        secret: '+rEchas&-wub24dR'
    };

    // Create our application and register its dependencies
    app = express();
    app.use(bodyParser.json());
    app.use(session(sessionConfig));
    app.use(timeout('30s'));

    // Register our OAUTH2 routes.
    app.get('/auth/authenticated', routes.auth.getAuthenticated);
    app.get('/auth/login', routes.auth.getLogin);
    app.get('/auth/callback', routes.auth.getCallback);
    app.get('/auth/logout', routes.auth.getLogout);

    // Register our SKY API routes.
    app.get('/api/constituents/:constituentId', routes.auth.checkSession, routes.api.getConstituent);

    // Register our front-end UI routes.
    app.use('/', express.static(__dirname + '/ui'));

    // Every route requires authorization.
    app.get('/', routes.auth.checkSession, function (request, response) {
        response.json({
            access_token: request.session.ticket
        });
    });

    // Display the startup message.
    function onListen() {
        console.log('SKY API Auth Code Flow Tutorial app running for https://localhost:%s/', process.env.PORT);
    }

    // Start the server.
    httpsOptions = {
        key: fs.readFileSync('./server/sslcerts/server.key', 'utf8'),
        cert: fs.readFileSync('./server/sslcerts/server.crt', 'utf8')
    };
    https.createServer(httpsOptions, app).listen(process.env.PORT, onListen);
}());
