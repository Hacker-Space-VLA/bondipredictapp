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
      <View style={styles.margs}>
        <View>
          <Text style={styles.title}>Emisor de ubicación de colectivo de villa la angostura</Text>
          <Text style={styles.texts}>Escribir la linea que usted está conduciendo para poder identificarlo</Text>
        </View>
        
        <View>
          <TextInput
            textColor="white"
            outlineColor="white"
            activeOutlineColor="#ff0055"
            style={{ backgroundColor: '#303030' }}
            label="colectivo"
            value={text}
            onChangeText={text => setText(text)}
            mode="outlined"
            autoCapitalize="words"
          />
        </View >
        <Text style={styles.texts}>linea actual: {text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pads: {
    padding: 20,
  },
  margs: {
    margin: 20,
  },
  texts: {

    paddingTop: 10,
    color: "#fff",
    fontSize: 14
  },
  title: {    
    color: "#fff",
    fontSize: 20,
    textAlign: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2.5,
    paddingBottom: 10
  }
})
export default App;