import { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useCallback } from "react";
import * as Location from "expo-location";

export default function App() {
  const [coordinates, setCoordinates] = useState();
  const [nearestPoint, setNearestPoint] = useState("");

  const handleCoordinates = useCallback(async () => {
    const response = await fetch(
      "https://portal-api-prod-etflayreta-ew.a.run.app/MobileApi"
    );
    const data = await response.json();
    const mappedDate = data.map((item) => {
      return {
        ...item,
        shouldNotTrack: false,
      };
    });
    setCoordinates(mappedDate);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    setCoordinates((prev) => {
      prev.push({
        shouldNotTrack: true,
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
        distanceInterval: 100,
      },
      (location) => {
        if (coordinates) {
          setNearestPointMethod(location);
        }
      }
    );
  }, [coordinates]);

  const setNearestPointMethod = (location) => {
    let nearestPoint = [];
    coordinates.forEach((item) => {
      const distance = calcCrow(
        item.geolocation.latitude,
        item.geolocation.longitude,
        location.coords.latitude,
        location.coords.longitude
      );
      if (distance < 30 && item.shouldNotTrack === false) {
        nearestPoint = [...nearestPoint, { distance: distance, item: item }];
      }
    });
    if (nearestPoint.length > 0) {
      const lowestDistance = nearestPoint.reduce((prev, current) =>
        prev.distance < current.distance ? prev : current
      );
      return setNearestPoint(lowestDistance);
    }
  };

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

  const removeCoordinate = () => {
    setCoordinates((prev) => {
      return prev.filter((item) => item !== nearestPoint.item);
    });
    setNearestPoint("");
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
          <>
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
          </>
        ))}
      </MapView>
      {nearestPoint && nearestPoint.item.shouldNotTrack === false && (
        <View style={styles.text}>
          <Text>{nearestPoint && nearestPoint.item.question}</Text>
          <View style={styles.button}>
            <Button
              onPress={removeCoordinate}
              title={nearestPoint && nearestPoint.item.answer}
            />
          </View>
          <View style={styles.button}>
            <Button
              style={styles.button}
              onPress={removeCoordinate}
              title={nearestPoint && nearestPoint.item.answer}
            />
          </View>

          <View style={styles.button}>
            <Button
              style={styles.button}
              onPress={removeCoordinate}
              title={nearestPoint && nearestPoint.item.answer}
            />
          </View>

          <View style={styles.button}>
            <Button
              style={styles.button}
              onPress={removeCoordinate}
              title={nearestPoint && nearestPoint.item.answer}
            />
          </View>
        </View>
      )}
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
  text: {
    textAlign: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  layout: {
    width: "100%",
    height: "100%",
  },
  button: {
    margin: 10,
  },
});
