const power =`<?xml version="1.0" encoding="ISO-8859-1"?>
<modules identity="Module" type="POWER" version="8.0">
<module width="500" height="500">
<name>Vcc</name>
<reference><label color="-16777216">Vcc,99.0,128.0,LEFT,PLAIN,8</label>
</reference>
<unit><label color="-16777216">5V,108.0,142.0,LEFT,PLAIN,8</label>
</unit>
<elements>
<ellipse x="104.0" y="133.0" width="3.0" height="3.0" thickness="1" fill="1"/>
<pin type="0"  style="0"   x="104.0" y="136.0" orientation="1">
</pin>
</elements>
</module>
<module width="500" height="500">
<name>Vcc</name>
<reference><label color="-16777216">J,192.0,243.0,LEFT,PLAIN,8</label>
</reference>
<unit><label color="-16777216">9-12V,192.0,290.0,LEFT,PLAIN,8</label>
</unit>
<elements>
<rectangle>192.0,245.0,24.0,38.0,1,1,5</rectangle>
<ellipse x="204.0" y="272.0" width="5.0" height="5.0" thickness="1" fill="1"/>
<line  thickness="1">206.0,270.0,202.0,274.0,</line>
<line  thickness="1">206.0,254.0,202.0,258.0,</line>
<ellipse x="204.0" y="256.0" width="5.0" height="5.0" thickness="1" fill="1"/>
<pin type="0"  style="0"   x="216.0" y="272.0" orientation="3">
</pin>
<pin type="0"  style="0"   x="216.0" y="256.0" orientation="3">
</pin>
</elements>
</module>
</modules`;
 
module.exports ={
		power,
		}