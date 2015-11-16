/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps the Parse.com objects.
 * @constructor
 * @param {Object} apiNxt
 * @returns {Object}
 *  {@link getApi}
 */
module.exports = function (apiNxt) {
  var https = require('request');

  /**
   * Gets a specific constituent by constituentID
   * @name getConstituent
   * @param {Object} request
   * @param {Object} response
   * @param {string} request.params.constituentId
   * @returns {string}
   */
  function getConstituent(request, response) {
    apiNxt.getConstituent(request, request.params.constituentId, function (results) {
      var jsonstring = JSON.stringify(results, null, '\t');
      console.log('response: ' + '\n' + jsonstring);
      response.send(results);

    });
  }

  // Expose any methods from our module
  return {
    getConstituent: getConstituent
  };
};
