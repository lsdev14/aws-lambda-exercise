'use strict';

console.log('Loading function');

const http = require('http');
const url = require('url');


exports.handler = (event, context, callback) => {

    var currency_url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22{0}{1}%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=';

    if (event.from === undefined || event.from === null || event.from === '') {
        event.from = 'USD';
    }

    if (event.to === undefined || event.to === null || event.to === '') {
        event.to = 'BRL';
    }

    currency_url = currency_url.replace('{0}', event.from);
    currency_url = currency_url.replace('{1}', event.to);

    var currency_req_opts = url.parse(currency_url);

    var req = http.get(currency_req_opts, function (res) {

        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(body);
            var message = "Converting 1 " + event.from + " to " + event.to + ": " + obj.query.results.rate.Rate;
            console.log(message);
            callback(null, message);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(e.message, null);
    });

};

