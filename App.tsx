import React, {useState} from 'react';
import {Text, View, StatusBar, PermissionsAndroid, Button } from 'react-native';
import { io } from "socket.io-client";
import Geolocation from 'react-native-geolocation-service';
import Leaflet, { Markers, TileOptions,Layers } from 'react-native-leaflet-ts';

// vars 
const lineas: Markers[] = [];



// Socket
const socket = io("https://bondipredict.onrender.com/");

socket.on("pos", function(data) {
  if(lineas.some(linea => linea.title === data.bus)){
    for (var bus of lineas) {
      if (bus.title = data.bus) {
        bus.latLng = [data.lat, data.lon]
      }
    }
      
  } else {
      if (data.bus !== undefined){
          lineas.push({
              latLng: [data.lat, data.lon],
              title: data.bus,
              iconSize: {
                width: 25,
                height: 25,
              },
          });
      }
  }  
  console.log(lineas)
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
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};
var userLocation = {
  lat: 0,
  lng: 0
}

function getLocation() {
  
  console.log("asked for Geolocation")
  const result = requestLocationPermission();
  result.then(res => {
    console.log('res is:', res);
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          userLocation.lat = position.coords.latitude
          userLocation.lng = position.coords.longitude
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
  return(userLocation)
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


// App
const App = () => {
  console.log("app running")
  return (
    <Leaflet
      mapLayers={mapLayers}
      minZoom={1}
      zoom={13}
      maxZoom={20}
      flyTo={{
        latLng: [-40.7627, -71.6418],
        zoom: 12,
      }}
      markers={lineas}
      backgroundColor="green"
    />
  );
}

export default App;