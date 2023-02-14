import React from 'react';
import {Text, View, StatusBar} from 'react-native';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import { io } from "socket.io-client";

// vars 

var lineas: {
  [x: string]: any; lon: any; 
}[] = []
var userlocation = {
    lat: null,
    lon: null,
    acc: null,
}
var colors = {
    bus1: "#FF00FF",
    bus2: "#FFFF00",
    bus3: "#00FFFF"
}

// Socket
const socket = io("https://bondipredict.onrender.com/");

socket.on("pos", function(data) {
  if(lineas.some(linea => linea.bus === data.bus)){
      var index = lineas.findIndex((obj => obj.bus == data.bus));
      lineas[index].lat = data.lat
      lineas[index].lon = data.lon
  } else {
      if (data.bus !== undefined){
          lineas.push({
              lat: data.lat,
              lon: data.lon,
              bus: data.bus
          });
      }
  }  
  console.log(lineas)
})

// Map

// App
const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Hello, world!</Text>
      <LeafletView

        // The rest of your props, see the list below
      />
    </View>
  );
};
export default App;