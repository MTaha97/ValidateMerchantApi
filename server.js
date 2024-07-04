var request = require('request');
var express = require('express');

var fs = require('fs');
var crypto = require('crypto');

// var CERT_PATH = 'cert/newCerts/cert.pem';
// var PRIVATE_KEY_PATH = 'cert/newCerts/key.pem';

var CERT_PATH = 'cert/merchant_id.pem';
var PRIVATE_KEY_PATH = 'cert/merchant_id.key';

var TOKEN_PATH = './token.json';

var cert = fs.readFileSync(CERT_PATH, 'utf-8');
var p_key = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
var forge = require('node-forge');

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Deployed Successfully.');
})

app.get('/merchant-session/new', function(req, res) {
    var merchantIdentifier = 'merchant.my-first-project-dd9fe.web.app';
    var uri = req.query.validationURL || 'https://apple-pay-gateway.apple.com/paymentservices/paymentSession';

    var options = {
        uri: uri,
        json: {
            merchantIdentifier: merchantIdentifier,
            displayName: "Apple",
            initiative: "web",
            initiativeContext: "my-first-project-dd9fe.web.app"
        },

        agentOptions: {
            cert: cert,
            key: p_key,
            rejectUnauthorized: false,
            passphrase: 'Abc_123'
        }
    };

    request.post(options, function(err, res, body) {
        if(body){
            console.log('Body ==> ' + body);
            delete body.displayName;
        }

        res.send(body);
        console.log(body);
        console.log('POST');
    });

});


var server = app.listen(3000, () => {
    console.log('Server running on ' + server.address().port);
    // console.log('Server running on ' + server.address().port);
})