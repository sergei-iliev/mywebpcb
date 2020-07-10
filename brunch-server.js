const express = require('express');
const fs = require('fs');
const app = express();


app.use(express.static(__dirname + '/public'));

//**************BOARD****************************************
app.get('/rest/boards/workspaces', (req, res, next) => {
	  res.send(
	  '<?xml version="1.0" encoding="UTF-8"?><workspace>'+
	  '<name>CardReader</name>'+	  
	  '<name>Demo</name>'+	  
	  '</workspace>'
	);
});
app.get('/rest/boards/workspaces/CardReader', (req, res, next) => {
	  res.send(
	'<?xml version="1.0" encoding="UTF-8"?><boards>'+
	'<name fullname="CR_v1" project="CR_v1">CR_v1</name>'+
	'<name fullname="CR_v2" project="CR_v2">CR_v2</name>'+
	'</boards>'
	);
	});
app.get('/rest/boards/workspaces/CardReader/CR_v1', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\workspace\\boards\\CardReader\\CardReader.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/boards/workspaces/CardReader/CR_v2', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\workspace\\boards\\CardReader\\wifidemo.xml','utf8', function(err, data) {
		res.send(data);
  });
});
//***************SYMBOLS****************************************
app.get('/rest/symbols/libraries', (req, res, next) => {
	  res.send(
	  '<?xml version="1.0" encoding="UTF-8"?><workspace>'+
	  '<name>Atmel</name>'+	  
	  '<name>General</name>'+	  
	  '<name>Microchip</name>'+	  
	  '</workspace>'
	);
});
app.get('/rest/symbols/libraries/Atmel/categories', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><category>'+
'<name library="Atmel" category="CPU">CPU</name>'+
'<name library="Atmel" category="Memory">Memory</name>'+
'<name library="Atmel" category="USB">USB</name>'+
'</category>'
);
});

app.get('/rest/symbols/libraries/General/categories', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><category>'+
'<name library="General">Diod</name>'+
'<name library="General">Fuse</name>'+
'</category>'
);
});

app.get('/rest/symbols/libraries/Atmel/categories/CPU', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><units>'+
'<name fullname="ATtiny26" category="CPU"  library="Atmel">ATtiny26</name>'+
'<name fullname="test" category="CPU"  library="Atmel">test</name>'+
'</units>'
);
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/ATtiny26', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\symbols\\Atmel\\CPU\\ATtiny26.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/test', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\symbols\\Atmel\\CPU\\test.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/General/categories/null/Diod', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\symbols\\General\\Test_8.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/General/categories/null/Fuse', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\symbols\\General\\Fuse.xml','utf8', function(err, data) {
		res.send(data);
  });
});
//***************PADS****************************************

app.get('/rest/footprints/libraries', (req, res, next) => {
  res.send(
  '<?xml version="1.0" encoding="UTF-8"?><library>'+
  '<name>Atmel</name>'+
  '<name>DIP</name>'+
  '<name>Demo</name>'+
  '<name>QFP</name>'+
  '<name>Microchip</name>'+
  '</library>'
);
});

app.get('/rest/footprints/libraries/Atmel/categories', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><category>'+
'<name library="Atmel" category="CPU">CPU</name>'+
'</category>'
);
});

app.get('/rest/footprints/libraries/Atmel/categories/CPU', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><units>'+
'<name fullname="mega8" category="CPU"  library="Atmel">mega8</name>'+
'<name fullname="Tiny2313" category="CPU"  library="Atmel">Tiny2313</name>'+
'<name fullname="Mega16" category="CPU"  library="Atmel">Mega16</name>'+
'<name fullname="test" category="CPU"  library="Atmel">test</name>'+
'<name fullname="test1" category="CPU"  library="Atmel">test1</name>'+
'<name fullname="testpackage" category="CPU"  library="Atmel">testpackage</name>'+
'</units>'
);
});

app.get('/rest/footprints/libraries/DIP/categories', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><units>'+
'<name fullname="mega8"  library="DIP">DIP-8</name>'+
'</units>'
);
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/testpackage', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\footprints\\Atmel\\CPU\\testpackage.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/mega8', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\footprints\\Atmel\\CPU\\mega8.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/test', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\footprints\\Atmel\\CPU\\test.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/test1', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\footprints\\Atmel\\CPU\\test1.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/DIP/categories/null/DIP-8', (req, res, next) => {
     fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy_8\\library\\footprints\\DIP\\DIP-8.xml','utf8', function(err, data) {
		res.send(data);
  });
});  
// Export the module like this for Brunch.
module.exports = (config, callback) => {
  // Server config is passed within the `config` variable.
  app.listen(config.port, function () {
    console.log(`myWebPCB app listening on port ${config.port}!`);
    callback();
  });

  // Return the app; it has the `close()` method, which would be ran when
  // Brunch server is terminated
  return app;
};