/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var app,
        dotenv;

    dotenv = require('dotenv').config({
        path: 'sky.env'
    });

    app = require('../index.js');

}());