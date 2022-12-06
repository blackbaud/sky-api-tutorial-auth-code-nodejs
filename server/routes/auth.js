/*jshint node: true */
(function () {
    'use strict';

    var crypto,
        authCodeClient,
        config;

    crypto = require('crypto');

    var { AuthorizationCode } = require('simple-oauth2');

    config = {
        client: {
            id: process.env.AUTH_CLIENT_ID,
            secret: process.env.AUTH_CLIENT_SECRET
        },
        auth: {
            tokenHost: 'https://oauth2.sky.blackbaud.com',
            authorizePath: '/authorization',
            tokenPath: '/token'
        },
        options: {
            authorizationMethod: 'body'
        }
    };

    authCodeClient = new AuthorizationCode(config);

    /**
     * Validates all requests.
     * @name checkSession
     * @param {Object} request
     * @param {Object} response
     * @param {Object} next
     */
    function checkSession(request, response, next) {
        validate(request, function (valid) {
            if (valid) {
                console.log("Session validated.");
                next();
            } else {
                console.log("Session not valid.");
                response.sendStatus(401);
            }
        });
    }


    /**
     * An interface for our front-end to see if we're authenticated.
     * @name getAuthenticated
     * @param {Object} request
     * @param {Object} response
     */
    function getAuthenticated(request, response) {
        validate(request, function (success) {
            var json = {
                authenticated: success
            };
            if (success) {
                json.tenant_id = request.session.ticket.tenant_id;
            }
            response.json(json);
        });
    }


    /**
     * Handles oauth response.
     * Validates the code and state querystring params.
     * Validates the PKCE code_verifier exists
     * Exchanges code for an access token and redirects user back to app home.
     * @name getCallback
     * @param {Object} request
     * @param {Object} response
     */
    async function getCallback(request, response) {
        var error,
            options,
            redirect,
            accessToken;

        if (request.query.error) {
            error = request.query.error;
        } else if (!request.query.code) {
            error = 'auth_missing_code';
        } else if (!request.query.state) {
            error = 'auth_missing_state';
        } else if (request.session.state !== request.query.state) {
            error = 'auth_invalid_state';
        } else if (!request.session.code_verifier) {
            error  = 'auth_missing_code_verifier';
        }

        if (!error) {
            options = {
                code: request.query.code,
                redirect_uri: process.env.AUTH_REDIRECT_URI,
                code_verifier: request.session.code_verifier
            };
            try {
                accessToken = await authCodeClient.getToken(options);

                redirect = request.session.redirect || '/';

                request.session.redirect = '';
                request.session.state = '';
                request.session.code_verifier = undefined;

                saveTicket(request, accessToken.token);
                response.redirect(redirect);
            } catch (errorToken) {
                error = errorToken.message;
            }
        }

        if (error) {
            response.redirect('/#?error=' + error);
        }
    }


    /**
     * Prepares our initial request to the oauth endpoint and redirects the user.
     * Handles an optional "redirect" querystring parameter, which we redirect to in getCallback.
     * @name getLogin
     * @param {Object} request
     * @param {Object} response
     */
    function getLogin(request, response) {
        var codeVerifier,
            codeChallenge,
            challengeDigest;

        function base64URLEncode(str) {
            return str.toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        }

        request.session.redirect = request.query.redirect;
        request.session.state = crypto.randomBytes(48).toString('hex');

        codeVerifier = base64URLEncode(crypto.randomBytes(32));
        challengeDigest = crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest();

        codeChallenge = base64URLEncode(challengeDigest);
        request.session.code_verifier = codeVerifier;

        response.redirect(authCodeClient.authorizeURL({
            redirect_uri: process.env.AUTH_REDIRECT_URI,
            state: request.session.state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        }));
    }


    /**
     * Revokes the tokens, clears our session, and redirects the user.
     * Handles an optional "redirect" querystring parameter.
     * @name getCallback
     * @param {Object} request
     * @param {Object} response
     */
    async function getLogout(request, response) {
        var redirect,
            accessToken;

        redirect = request.session.redirect || '/';

        function go() {
            request.session.destroy();
            response.redirect(redirect);
        }

        if (!request.session.ticket) {
            go();
        } else {
            try {
                accessToken = authCodeClient.createToken(request.session.ticket);
                await accessToken.revokeAll({json: true});
                go();
            } catch (error) {
                console.log('Error revoking token: ', error.message);
            }
        }
    }


    /**
     * Internal function for saving ticket + expiration.
     * @internal
     * @name saveTicket
     * @param {Object} request
     * @param {Object} ticket
     */
    function saveTicket(request, ticket) {
        request.session.ticket = ticket;
        request.session.expires = (new Date().getTime() + (1000 * ticket.expires_in));
    }


    /**
     * An interface for our front-end to see if we're authenticated.
     * @name getAuthenticated
     * @param {Object} request
     * @param {Object} response
     */
    async function validate(request, callback) {
        var dtCurrent,
            dtExpires,
            accessToken;

        if (request.session && request.session.ticket && request.session.expires) {

            dtCurrent = new Date();
            dtExpires = new Date(request.session.expires);

            if (dtCurrent >= dtExpires) {
                console.log('Token expired');

                // Check if the token is expired. If expired it is refreshed.
                accessToken = authCodeClient.createToken(request.session.ticket);

                try {
                    accessToken = await accessToken.refresh();
                
                    saveTicket(request, accessToken.token);
                    callback(true);
                } catch (_) {
                    callback(false);
                }
            } else {
                callback(true);
            }
        } else {
            callback(false);
        }
    }


    /**
     * Auth class which lightly wraps the simple-oauth2 package.
     * Provides the necessary methods for interacting with Blackbaud's OAUTH2 implemenation.
     * @constructor
     * @returns {Object}
     *  {@link getAuthenticated}
     *  {@link getLogin}
     *  {@link getCallback}
     *  {@link getLogout}
     */
    module.exports = {
        checkSession: checkSession,
        getAuthenticated: getAuthenticated,
        getCallback: getCallback,
        getLogin: getLogin,
        getLogout: getLogout
    };
}());