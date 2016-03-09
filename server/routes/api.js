/*jshint node: true */
(function () {
    'use strict';

    var Sky;

    Sky = require('../libs/sky');

    /**
     * Gets a specific constituent by constituentId
     * @name getConstituent
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituent(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            console.log('getConstituent() response:\n' + JSON.stringify(results, null, '\t'));
            response.send(results);
        });
    }

    module.exports = {
        getConstituent: getConstituent
    };
}());