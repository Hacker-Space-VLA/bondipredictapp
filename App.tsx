import React from 'react';
import {Text, View, StatusBar} from 'react-native';
import { LatLng, LeafletView } from 'react-native-leaflet-view';

const HelloWorldApp = () => {
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
export default HelloWorldApp;