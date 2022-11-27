import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useCallback } from "react";
import * as Location from "expo-location";

export default function App() {
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const [coordinates, setCoordinates] = useState();

  const handleCoordinates = useCallback(async () => {
    const response = await fetch(
      "https://portal-api-prod-etflayreta-ew.a.run.app/MobileApi"
    );
    const data = await response.json();
    setCoordinates(data);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    console.log(`currentLocation`, currentLocation, `data \n`, data);
    setCoordinates((prev) => {
      prev.push({
        geolocation: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
      });
      return [...prev];
    });
  }, []);

  useEffect(() => {
    handleCoordinates();
  }, []);

  if (!coordinates) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 49.783572,
          longitude: 19.05895,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {coordinates.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.geolocation.latitude,
              longitude: marker.geolocation.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
