import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LeafletView, LeafletViewProps, LatLng } from 'react-native-leaflet-view';
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <WebView
      source={{ uri: "https://bondipredict.onrender.com/recieve/" }}
      style={styles.container}
    />
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    height: "90%",
    backgroundColor: "#000"
  },
});
