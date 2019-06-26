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
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\workspace\\boards\\CardReader\\CardReader.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/boards/workspaces/CardReader/CR_v2', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\workspace\\boards\\CardReader\\wifidemo.xml','utf8', function(err, data) {
		res.send(data);
  });
});
//***************PADS****************************************
// AJAX to /action.
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
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\footprints\\Atmel\\CPU\\testpackage.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/mega8', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\footprints\\Atmel\\CPU\\mega8.xml','utf8', function(err, data) {
		res.send(data);
  });
});
app.get('/rest/footprints/libraries/Atmel/categories/CPU/test', (req, res, next) => {
    fs.readFile('C:\\sergei\\java\\myNetPCB\\deploy\\library\\footprints\\Atmel\\CPU\\test.xml','utf8', function(err, data) {
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
app.get('/rest/footprints/libraries/Atmel/categories/CPU/Tiny2313', (req, res, next) => {
  res.send(
'<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>'+
'<footprints identity="Footprint" version="1.0">'+
'<footprint height="400000" width="400000">'+
'<name>DIP</name>'+
'<reference>U***,192000,184320,LEFT,PLAIN,10000</reference>'+
'<value>Tiny2313,184832,200704,LEFT,PLAIN,10000</value>'+
'<units raster="2.54">MM</units>'+
'<shapes>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="330200" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>11,328024,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(ICP)PD6,326808,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="330200" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="304800" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>12,302624,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(AIN0/PCINT0)PB0,297568,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="304800" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="279400" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>13,277096,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(AIN1/PCINT1)PB1,272040,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="279400" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="254000" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>14,251952,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(OC0A/PCINT2)PB2,246704,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="254000" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="228600" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>15,226552,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(OC1A/PCINT3)PB3,221496,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="228600" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="203200" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>16,201152,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(OC1B/PCINT4)PB4,195840,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="203200" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="177800" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>17,175496,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(MOSI/DI/SDA/PCINT5)PB5,167560,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="177800" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="152400" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>18,150224,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(MISO/DO/PCINT6)PB6,144016,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="152400" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="127000" y="152400">'+
'<offset x="0" y="0"/>'+
'<number>19,124824,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>(UCSK/SCL/PCINT7)PB7,118232,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="127000" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="101600" y="152400">'+
'<offset x="0" y="0"/>'+

'<number>20,99424,153808,LEFT,PLAIN,4000</number>'+
'<netvalue>VCC,100384,147216,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="101600" y="152400"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="101600" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>1,100576,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(RESET/dW)PA2,95712,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="101600" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="127000" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>2,126232,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(RXD)PD0,123480,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="127000" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="152400" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>3,151376,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(TXD)PD1,149136,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="152400" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="177800" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>4,176776,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(XTAL2)PA1,173320,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="177800" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="203200" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>5,202688,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(XTAL1)PA0,198720,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="203200" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="228600" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>6,227576,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(CKOUT/XCK/INT0)PD2,219960,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="228600" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="254000" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>7,252976,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(INT1)PD3,250096,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="254000" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="279400" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>8,278376,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(T0)PD4,276520,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="279400" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="304800" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>9,304032,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>(OC0B/T1)PD5,299488,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="304800" y="228600"/>'+
'</pad>'+
'<pad arc="14700" copper="BCu" height="14700" shape="CIRCULAR" type="THROUGH_HOLE" width="14700" x="330200" y="228600">'+
'<offset x="0" y="0"/>'+
'<number>10,328152,229752,LEFT,PLAIN,4000</number>'+
'<netvalue>GND,328984,234487,LEFT,PLAIN,1500</netvalue>'+
'<drill height="6000" type="CIRCULAR" width="8100" x="330200" y="228600"/>'+
'</pad>'+
'<rectangle arc="2000" fill="0" height="65000" thickness="2000" width="256000" x="86336" y="158028"/>'+
'<arc copper="FSilkS" extend="180" fill="0" start="-90" thickness="2000" type="0" width="10608" x="81224" y="185928"/>'+
'</shapes>'+
'</footprint>'+
'<footprint height="300000" width="300000">'+
'<name>MLF</name>'+
'<reference>U***,145944,152192,LEFT,PLAIN,4000</reference>'+
'<value>Tiny2313,141976,146688,LEFT,PLAIN,4000</value>'+
'<units raster="0.1">MM</units>'+
'<shapes>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="132000" y="141000">'+
'<offset x="0" y="0"/>'+
'<number>1,133168,141672,RIGHT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="132000" y="146000">'+
'<offset x="0" y="0"/>'+
'<number>2,133168,146640,RIGHT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="132000" y="151000">'+
'<offset x="0" y="0"/>'+
'<number>3,133168,151608,RIGHT,PLAIN,2000</number>'+

'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="132000" y="156000">'+
'<offset x="0" y="0"/>'+
'<number>4,133168,156672,RIGHT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="132000" y="161000">'+
'<offset x="0" y="0"/>'+
'<number>5,133168,161640,RIGHT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="141000" y="132000">'+
'<offset x="0" y="0"/>'+
'<number>20,141608,131840,TOP,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="146000" y="132000">'+
'<offset x="0" y="0"/>'+
'<number>19,146608,131840,TOP,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="151000" y="132000">'+
'<offset x="0" y="0"/>'+
'<number>18,151640,131840,TOP,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="156000" y="132000">'+
'<offset x="0" y="0"/>'+
'<number>17,156640,131840,TOP,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="161000" y="132000">'+
'<offset x="0" y="0"/>'+
'<number>16,161608,131840,TOP,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="169000" y="161000">'+
'<offset x="0" y="0"/>'+
'<number>11,166696,161576,LEFT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="169000" y="156000">'+
'<offset x="0" y="0"/>'+
'<number>12,166696,156576,LEFT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="169000" y="151000">'+
'<offset x="0" y="0"/>'+
'<number>13,166696,151512,LEFT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="169000" y="146000">'+
'<offset x="0" y="0"/>'+
'<number>14,166696,146576,LEFT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="2300" shape="RECTANGULAR" type="SMD" width="6000" x="169000" y="141000">'+
'<offset x="0" y="0"/>'+
'<number>15,166696,141576,LEFT,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="161000" y="169000">'+
'<offset x="0" y="0"/>'+
'<number>10,161576,169128,BOTTOM,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="156000" y="169000">'+
'<offset x="0" y="0"/>'+
'<number>9,156576,169128,BOTTOM,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="151000" y="169000">'+
'<offset x="0" y="0"/>'+
'<number>8,151576,169128,BOTTOM,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="146000" y="169000">'+
'<offset x="0" y="0"/>'+
'<number>7,146576,169128,BOTTOM,PLAIN,2000</number>'+
'</pad>'+
'<pad arc="2300" copper="FCu" height="6000" shape="RECTANGULAR" type="SMD" width="2300" x="141000" y="169000">'+
'<offset x="0" y="0"/>'+
'<number>6,141640,169128,BOTTOM,PLAIN,2000</number>'+
'</pad>'+
'<rectangle arc="0" fill="0" height="40000" thickness="2000" width="40000" x="130576" y="130424"/>'+
'<ellipse copper="FSilkS" fill="0" height="3000" thickness="1000" width="3000" x="135016" y="135008"/>'+
'</shapes>'+
'</footprint>'+
'<footprint height="500000" width="500000">'+
'<name>SOIC</name>'+
'<reference>U***,233372,256524,LEFT,PLAIN,10000</reference>'+
'<value>SOIC-20,229276,240652,LEFT,PLAIN,10000</value>'+
'<units raster="1.27">MM</units>'+
'<shapes>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="190500" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>20,191780,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="203200" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>19,204736,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="215900" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>18,217052,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="228600" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>17,229752,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="241300" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>16,242580,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="254000" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>15,255280,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="266700" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>14,267980,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="279400" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>13,280424,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="292100" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>12,293252,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="304800" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>10,306464,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="292100" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>9,293508,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="279400" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>8,280680,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="266700" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>7,268236,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="254000" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>6,255280,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="241300" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>5,242708,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="228600" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>4,230008,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="215900" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>3,217308,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="203200" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>2,204480,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="190500" y="292100">'+
'<offset x="0" y="0"/>'+
'<number>1,191524,295172,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<pad arc="14700" copper="FCu" height="12000" shape="RECTANGULAR" type="SMD" width="5100" x="304800" y="203200">'+
'<offset x="0" y="0"/>'+
'<number>11,305824,202560,BOTTOM,PLAIN,4000</number>'+
'</pad>'+
'<rectangle arc="8000" fill="0" height="75000" thickness="2100" width="125968" x="185000" y="210004"/>'+
'<ellipse copper="FSilkS" fill="0" height="9840" thickness="1000" width="9840" x="192136" y="267924"/>'+
'</shapes>'+
'</footprint>'+
'<library>Atmel</library>'+
'<category>CPU</category>'+
'<filename>Tiny2313</filename>'+
'</footprints>'

);
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