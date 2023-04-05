import React, {useEffect, useState} from 'react';
import {Text, View, StatusBar, PermissionsAndroid, Button, StyleSheet } from 'react-native';
import { io } from "socket.io-client";
import Geolocation from 'react-native-geolocation-service';
import { TextInput } from 'react-native-paper';

// vars 


// Socket
const socket = io("https://bondipredict.onrender.com/");

setInterval(()=>{
  getLocation()
  var data = {
    lat: usrLocation.lat,
    lon: usrLocation.lng,
    bus: bus,
    key: "dsaasddsaasd",
    id: socket.id
  }
  socket.emit("pos",data)
  console.log(data)
}, 1000)
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

var bus = "x"
// App
const App = () => {
  const [text, setText] = React.useState("");
  
  bus = text
  return (
    <View>
      <Text>bus: {text}</Text>
      <View>
        <TextInput
          label="bus"
          value={text}
          onChangeText={text => setText(text)}
          mode="outlined"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  locview: {
    backgroundColor: "#3e3e3e",
    justifyContent: 'center',
    alignItems: 'center'
    
  }
})
export default App;