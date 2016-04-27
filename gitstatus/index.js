var https   = require('https'),
    urlTool = require('url'); 

module.exports = function (context) {
    var secret = context.bindings.inputDocument;
    var message = context.bindings.message;
    
    var user = secret.body.username;
    var password = secret.body.password;
    
    var parsedUrl = urlTool.parse(message.url);
    
    var data = JSON.stringify({
        "state": message.status, 
        "target_url": "https://example.com/build/status",
        "description": "The is a status from TR... for  "
    }); 
    
    var options = {
      hostname: parsedUrl.host,
      port: 443,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(user, password),
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'AzureFunctionsRock'
      }
    };
    
    context.log(options.headers);
    
    var req = https.request(options, (res) => {
      context.log(`STATUS: ${res.statusCode}`);
      context.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.')
        context.done();
      })
    });
    
    req.on('error', (e) => {
        context.log(`problem with request: ${e.message}`);
    });
    
    req.write(data);
    req.end();

    //context.log(message);
    //context.log(secret);
    //context.done();
};

function getAuthHeader(username, password){
    var auth = 'Basic ' + btoa(username  + ':' + password);
    return auth;
}

function btoa(str) {
  if (Buffer.byteLength(str) !== str.length)
    throw new Error('bad string!');
  return Buffer(str, 'binary').toString('base64');
}


