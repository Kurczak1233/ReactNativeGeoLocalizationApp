import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState } from "react";

export default function App() {
  const [coordinates, setCoordinates] = useState();

  const handleCoordinates = async () => {
    const response = await fetch(
      "https://portal-api-prod-etflayreta-ew.a.run.app/MobileApi"
    );
    fetch("https://portal-api-prod-etflayreta-ew.a.run.app/MobileApi")
      .then((response) => response.json())
      .then((data) => console.log(`data`, data));

    const data = await response.json();
    setCoordinates(data);
  };

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
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {coordinates.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.geolocation.latitude,
              longitude: marker.geolocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
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
