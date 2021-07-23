import * as React from "react";
// import MapView, { Callout, Circle, Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";

export default function SunTimes({ location }) {
  const [sunTimes, setSunTimes] = React.useState({});
  const [locationEntry, setLocation] = React.useState(location); //location typed by user
  const [inputModal, setInputModal] = React.useState(false); //location typed by user

  function getSunTimes() {
    if (locationEntry !== "") {
      let theLoaction = "";
      const lst = locationEntry.split(" ");
      for (const word in lst) {
        theLoaction += lst[word] + "+";
      }

      const theLink = `https://maps.googleapis.com/maps/api/geocode/json?&address=${theLoaction},+CA&key=AIzaSyD5DXTrnTltkZ4w-QFYRSx91sEi9tmj9IE`;
      fetch(theLink)
        .then((res) => res.json())
        .then((resJson) => {
          const locationResult = resJson.results;
          //   setAddress(locationResult[0].formatted_address);

          const lat = locationResult[0].geometry.location.lat;
          const lng = locationResult[0].geometry.location.lng;
          const sunsetUrl = `https://api.ipgeolocation.io/astronomy?apiKey=4e4db7d128ae4d0993ce50d4cfee8fb7&lat=${lat}&long=${lng}`;
          fetch(sunsetUrl)
            .then((res) => res.json())
            .then((resJson) => {
              // console.log(resJson);
              setSunTimes(resJson);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.lg(err));
    } else {
      console.log("in modal");
      setInputModal(true);
    }
  }
  React.useEffect(() => {
    getSunTimes();
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#7FFFD4",
        }}
      >
        Sun Set: {sunTimes.sunset} {"\t"} Sun Rise: {sunTimes.sunrise}
      </Text>
      <Modal visible={inputModal}>
        <View style={styles.modalContainer}>
          <Text style={{ textAlign: "center" }}>
            Enter a Loaction for which you want the Sun Set and Sun Rise for:
          </Text>
          <TextInput
            style={{ width: 150, backgroundColor: "#E0FFFF", borderRadius: 20 }}
            placeholder={"Enter Location"}
            value={locationEntry}
            onChangeText={(text) => {
              setLocation(text);
            }}
          />
          <TouchableOpacity
            style={styles.ok}
            onPress={() => {
              if (locationEntry !== "") {
                getSunTimes();
                setInputModal(false);
              } else {
                Alert.alert(
                  "Please Enter a Location",
                  "The Location can not be an empty String",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    //   { text: "OK", onPress: () => console.log("OK Pressed") },
                  ]
                );
              }
            }}
          >
            <Text>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ok}
            onPress={() => {
              setInputModal(false);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 30,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 30,
    backgroundColor: "#6495ED",
  },
  ok: {
    backgroundColor: "#00BFFF",
  },
});
