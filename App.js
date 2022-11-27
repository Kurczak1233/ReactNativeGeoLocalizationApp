import { useEffect } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useCallback } from "react";
import * as Location from "expo-location";

export default function App() {
  const [coordinates, setCoordinates] = useState();
  const [nearestPointText, setNearestPointText] = useState("");

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

  useEffect(() => {
    foregroundSubscrition = Location.watchPositionAsync(
      {
        // Tracking options
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        if (coordinates) {
          coordinates.forEach((item) => {
            const distance = calcCrow(
              item.geolocation.latitude,
              item.geolocation.longitude,
              location.coords.latitude,
              location.coords.longitude
            );
            console.log(distance);
            if (distance < 30 && distance != 0) {
              return setNearestPointText(item.locatlizationName);
            }
          });
        }
      }
    );
  }, [coordinates]);

  // Converts numeric degrees to radians
  const toRad = (Value) => {
    return (Value * Math.PI) / 180;
  };

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  const calcCrow = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  if (!coordinates) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
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
      <Text>{nearestPointText}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
