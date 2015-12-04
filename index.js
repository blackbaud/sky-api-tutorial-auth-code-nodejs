/*jslint node: true, es5: true, nomen: true*/
'use strict';

var auth,
    apiNxt,
    apiSky,
    app,
    bodyParser,
    express,
    fs,
    http,
    https,
    httpsOptions,
    session,
    sessionConfig,
    timeout;

// Application dependencies
auth = require('./server/auth.js')();
apiNxt = require('./server/api-nxt.js')(auth);
apiSky = require('./server/api-sky.js')(apiNxt);
bodyParser = require('body-parser');
express = require('express');
fs = require('fs');
http = require('http');
https = require('https');
session = require('express-session');
timeout = require('connect-timeout');

// If deployed in our demo site, we store the sessions using Redis
// Locally we store the sessions in memory
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

// Register our OAUTH2 routes
app.get('/auth/authenticated', auth.getAuthenticated);
app.get('/auth/login', auth.getLogin);
app.get('/auth/callback', auth.getCallback);
app.get('/auth/logout', auth.getLogout);

// Validates all requests
function requireSession(request, response, next) {
    auth.validate(request, function (valid) {
        if (valid) {
            next();
        } else {
            response.sendStatus(401);
        }
    });
}



// Register our SKY API routes
app.get('/api/constituents/:constituentId', requireSession, apiSky.getConstituent);


// Register our front-end UI routes
//app.use('/', express.static(__dirname + '/ui'));
app.use('/', express['static'](__dirname + '/ui'));

app.get('/', requireSession, function (request, response) {
    console.log(request.session.ticket);
    response.json({
        access_token: request.session.ticket
    });
});



// Displays the startup message
function onListen() {
    console.log('SKY API Auth Code Flow Tutorial app running for https://localhost:%s/', process.env.PORT);
}

httpsOptions = {
    key: fs.readFileSync('sslcerts/server.key', 'utf8'),
    cert: fs.readFileSync('sslcerts/server.crt', 'utf8')
};
https.createServer(httpsOptions, app).listen(process.env.PORT, onListen);
