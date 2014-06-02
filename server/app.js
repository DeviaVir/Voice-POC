#!/usr/bin/env node

var Primus  = require('primus'),
    http    = require('http'),
    message = '';

var server  = http.createServer().listen(13337),
    primus  = new Primus(server, { transformer: 'websockets' });

primus.on('connection', function (spark) {
  // spark is the new connection.
  console.log('Detected connection');

  console.log('Emitting message');
  primus.write({'message': message});

  spark.on('data', function (data) {
    console.log('Received data from spark');
    console.log(data);

    if('message' in data) {
      var res = {'message': data.message};
      if('timestamp' in data) {
        var date = new Date().getTime();
        res.delay = (date - data.timestamp);
      }
      primus.write(res);
      message = data.message;
    }
  });
});