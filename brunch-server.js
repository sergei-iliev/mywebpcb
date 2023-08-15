const express = require('express');
const fs = require('fs');
const app = express();


app.use(express.static(__dirname + '/public'));

// Export the module like this for Brunch.
module.exports = (config, callback) => {
  // Server config is passed within the `config` variable.
  app.listen(config.port, function () {
    console.log(`Example app listening on port ${config.port}!`);
    callback();
  });

  // Return the app; it has the `close()` method, which would be ran when
  // Brunch server is terminated
  return app;
};
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
	'<name fullname="proba" project="proba">proba</name>'+
	'</boards>'
	);
	});
app.get('/rest/boards/workspaces/CardReader/proba', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\workspace\\boards\\demo\\print_demo.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/boards/workspaces/CardReader/CR_v1', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\workspace\\boards\\CardReader\\CardReader.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/boards/workspaces/CardReader/CR_v2', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\workspace\\boards\\CardReader\\wifidemo.xml','utf8', function(err, data) {
		res.send(data);
  });
});
//***************CIRCUITS****************************************
app.get('/rest/circuits/workspaces', (req, res, next) => {
	  res.send(
	  '<?xml version="1.0" encoding="UTF-8"?><workspace>'+
	  '<name>CardReader</name>'+	  
	  '<name>Demo</name>'+	 
	  '<name>Evolex</name>'+		  
	  '</workspace>'
	);
});
app.get('/rest/circuits/workspaces/CardReader', (req, res, next) => {
	  res.send(
	'<?xml version="1.0" encoding="UTF-8"?><circuits>'+
	'<name fullname="CR v1" project="CR v1">CR v1</name>'+
	'<name fullname="CR v2" project="CR v2">CR v2</name>'+
	'</circuits>'
	);
	});
app.get('/rest/circuits/workspaces/CardReader/CR%20v1', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\Java_11\\deploy\\workspace\\circuits\\DEMO\\1-Wire.xml','utf8', function(err, data) {
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
'<name library="General">Ground</name>'+
'<name library="General">Fuse</name>'+
'<name library="General">Resistor</name>'+
'</category>'
);
});

app.get('/rest/symbols/libraries/Atmel/categories/CPU', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="UTF-8"?><units>'+
'<name fullname="at90s2313" category="CPU"  library="Atmel">at90s2313</name>'+
'<name fullname="ATtiny26" category="CPU"  library="Atmel">ATtiny26</name>'+
'<name fullname="ATMega2560" category="CPU"  library="Atmel">ATMega2560</name>'+
'<name fullname="test" category="CPU"  library="Atmel">test</name>'+
'</units>'
);
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/ATtiny26', (req, res, next) => {
    fs.readFile('D:\\sergei\\java\\myNetPCB\\deploy\\library\\symbols\\Atmel\\CPU\\ATtiny26.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/ATMega2560', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\library\\symbols\\Atmel\\CPU\\MEGA2560.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/at90s2313', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\Java_11\\deploy\\library\\symbols\\Atmel\\CPU\\at90s2313.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/Atmel/categories/CPU/test', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\symbols\\Atmel\\CPU\\test.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/General/categories/null/Ground', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\library\\symbols\\General\\Ground.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/symbols/libraries/General/categories/null/Resistor', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\Java_11\\deploy\\library\\symbols\\General\\Resistor.xml','utf8', function(err, data) {
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
'<name fullname="Mega328" category="CPU"  library="Atmel">Mega328</name>'+
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
app.get('/rest/footprints/libraries/Atmel/categories/CPU/test1', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\java_11\\deploy\\library\\footprints\\Atmel\\CPU\\mega8_MLF_bug.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/mega8', (req, res, next) => {
    fs.readFile('D:\\sergei\\myNetPCB\\Java_11\\deploy\\library\\footprints\\Atmel\\CPU\\mega8.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/Mega328', (req, res, next) => {
    fs.readFile('D:\\sergei\\java\\myNetPCB\\Java_11\\deploy\\library\\footprints\\Atmel\\CPU\\Mega328.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/test1', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\footprints\\Atmel\\CPU\\test1.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/DIP/categories/null/DIP-8', (req, res, next) => {
     fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\footprints\\DIP\\DIP-8.xml','utf8', function(err, data) {
		res.send(data);
  });
});  