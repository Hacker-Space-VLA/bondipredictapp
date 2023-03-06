import React, {useEffect, useState} from 'react';
import {Text, View, StatusBar, PermissionsAndroid, Button } from 'react-native';
import { io } from "socket.io-client";
import Geolocation from 'react-native-geolocation-service';
import Leaflet, { Markers, TileOptions, Layers } from 'react-native-leaflet-ts'; 

// vars 
const lineas: Markers[] = [];


// Socket
const socket = io("https://bondipredict.onrender.com/");

socket.on("pos", function(data) {
  if(lineas.some(linea => linea.title === data.bus)){
    for (var bus of lineas) {
      if (bus.title = data.bus) {
        bus.latLng = [parseFloat(data.lat) , parseFloat(data.lon)]

      }
    }
      
  } else {
      if (data.bus !== undefined){
          lineas.push({
              latLng: [parseFloat(data.lat) , parseFloat(data.lon)],
              title: data.bus,
              iconSize: {
                width: 25,
                height: 25,
              },
          });
      }
  }
})

// Location


const requestLocationPermission = async () => {

  console.log("--------------------------------------------------------------------------------------------------------------")
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    //console.log('granted', granted);
    if (granted === 'granted') {
      //console.log('You can use Geolocation');
      return true;
    } else {
      //console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

var usrLocation = {
  lat: 0,
  lng: 0
}
function getLocation() {
  return new Promise(resolve => {
    //console.log("asked for Geolocation")
  const result = requestLocationPermission();
  result.then(res => {
    if (res) {
      
      Geolocation.getCurrentPosition(position => {
        usrLocation.lat = position.coords.latitude
        usrLocation.lng = position.coords.longitude
        var data = [
          position.coords.latitude,
          position.coords.longitude
        ]
        
        resolve(data)
        //return({lat: position.coords.latitude, lng: position.coords.longitude})
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      )
    }
  }); 
  })
  
}

// Map
const options: TileOptions = {
  noWrap: true,
  updateInterval: 100
};

const mapLayers: Layers[] = [
  {
    name: 'Floor 1',
    src: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileOptions: options,
  }
];


var moved = false
// App
const App = () => {
  var [loc, setLoc] = useState([usrLocation.lat, usrLocation.lng]);
  
  const askloc = async () => {
    //console.log("ask loc")
    const result = await getLocation()
    console.log("loc: ", result)
    return(result)
  }

  if (moved == false) {
    askloc().then(function() {
      setLoc([usrLocation.lat, usrLocation.lng])
      moved = true
    })
  }

  var [buses, setBuses] = useState(lineas)

  
  
  return (
      <Leaflet
      mapLayers={mapLayers}
      minZoom={2}
      flyTo={{
        latLng: loc,
        zoom: 12,
      }}
      markers={buses}
      backgroundColor="#b0d4dc"
      injectJavascript={(
        useEffect(() => {
          setInterval(()=> {
            setBuses(lineas)
            console.log("buses: ", buses)
          }, 1000)
        }, [buses])
      )}
    />
  )
}
export default App;