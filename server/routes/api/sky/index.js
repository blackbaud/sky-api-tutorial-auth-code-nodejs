/*jshint node: true */
(function () {
    'use strict';

    var ApiNxt,
        https;

    https = require('request');


    /**
     * Gets a specific constituent by constituentID
     * @name getConstituent
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituent(request, response) {
        ApiNxt.getConstituent(request, request.params.constituentId, function (results) {
            var jsonString;

            jsonString = JSON.stringify(results, null, '\t');
            console.log('getConstituent Response: ' + '\n' + jsonString);

            response.send(results);
        });
    }


    module.exports = function (apiNxt) {
        ApiNxt = apiNxt;
        return {
            getConstituent: getConstituent
        };
    };
}());