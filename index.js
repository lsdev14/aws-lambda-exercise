'use strict';

console.log('Loading function');

const http = require('http');
const url = require('url');

const currency_url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDBRL%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=';
const currency_req_opts = url.parse(currency_url);

exports.handler = (event, context, callback) => {

    var req = http.get(currency_req_opts, function (res) {

        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(body);
            console.log("currency: " + obj.query.results.rate.Rate);
            callback(null, obj.query.results.rate.Rate);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(e.message, null); 
    });
    
};