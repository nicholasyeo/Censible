import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { API_KEY } from "react-native-dotenv";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import PlaceFilteringModal from "./PlaceFilteringModal";

export default class ExploreScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      errorMessage: "",
      modalVisible: false,
    };

    this.requestLocationPermission();
  }

  setModalVisible = (modalVisible) => this.setState({ modalVisible });

  requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      this.setState({ errorMessage: "Permission not granted" });
    }

    const userLocation = await Location.getCurrentPositionAsync();

    this.setState({
      initialRegion: {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.005,
      },
    });
  };

  getNearbyPlaces = (rad, placeType, price) => {
    const { latitude, longitude } = this.state.initialRegion;
    let radius = rad * 1000;

    let url =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
      "location=" +
      latitude +
      "," +
      longitude +
      "&radius=" +
      radius +
      "&type=" +
      placeType +
      "&maxprice=" +
      price +
      "&key=" +
      API_KEY;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const tempHolder = [];
        let id = 0;
        json.results.forEach((place) => {
          let obj = {
            id: id,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            name: place.name,
            vicinity: place.vicinity,
          };
          id++;
          tempHolder.push(obj);
        });
        this.setState({ places: tempHolder });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, zIndex: -1 }}
          provider={PROVIDER_GOOGLE}
          ref={(map) => (this.map = map)}
          showsUserLocation={true}
          initialRegion={this.state.initialRegion}
        >
          {this.state.places.map((place) => {
            return (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.vicinity}
              />
            );
          })}
        </MapView>
        <View style={styles.icon}>
          <Ionicons
            reverse
            name="md-compass"
            color="#378BE5"
            size={55}
            style={{ borderRadius: 10 }}
            onPress={() => this.setModalVisible(!modalVisible)}
            // onPress={this.testingAPI}
          />
        </View>
        <PlaceFilteringModal
          modalVisible={modalVisible}
          setModalVisible={this.setModalVisible}
          getNearbyPlaces={this.getNearbyPlaces}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    flex: 1,
    position: "absolute",
    width: 50,
    height: 60,
    top: "90%", // to align vertically at the bottom
    alignSelf: "center", // to align horizontally center
    zIndex: 10,
  },
});
