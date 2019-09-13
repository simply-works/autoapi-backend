var request = require('request');
var jwkToPem = require('jwk-to-pem'),
    jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
global.navigator = () => null;

const { aws_cognito_auth_url } = require('../../config/config');

exports.validate = function (req, res, next) {
    // return next();
    var token = req.headers['authorization'];
    request({
        url: aws_cognito_auth_url,
        json: true
    }, function (error, response, body) {
        if(error) {
            console.log("Error! Unable to download JWKs");
            res.status(500);
            return res.send("Error! Unable to download JWKs");
        }
        if (response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            var decodedJwt = jwt.decode(token, { complete: true });
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                res.status(401);
                return res.send("Invalid token");
            }
            var kid = decodedJwt.header.kid;
            var pem = pems[kid];
            if (!pem) {
                console.log('Invalid token');
                res.status(401);
                return res.send("Invalid token");
            }
            jwt.verify(token, pem, function (err, payload) {
                if (err) {
                    console.log("Invalid Token.");
                    res.status(401);
                    return res.send("Invalid tokern");
                } 
                console.log('payoad',payload.username);
                req.body.user_id = payload.username
                console.log("Valid Token.");
                return next();
            });
        }
    });
}