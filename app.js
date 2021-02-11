var express = require('express');
var app = express();
var compression = require('compression');

app.use(compression());

app.use(express.static('/home/jason/www/opentrons'));

app.listen(3415);

console.log("Running on 3415...");

