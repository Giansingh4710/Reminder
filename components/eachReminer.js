import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";

import { Icon } from "react-native-elements";

import DetailsModal from "./notificationDetails";

export default function ReminderItem({
  state,
  dispatch,
  actions,
  id,
  data,
  index,
}) {
  const [detailsModal, setModal] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        setModal(true);
      }}
      style={
        index % 2 === 0
          ? styles.container
          : { ...styles.container, backgroundColor: "#7CB9E8" }
      }
    >
      <DetailsModal theVisible={detailsModal} setModal={setModal} data={data} />

      <View style={styles.item}>
        {/* <Text style={styles.text}>Set At:</Text> */}
        <Text style={styles.text}>
          {"Set:\n" +
            data.notificationSetDate.toLocaleDateString() +
            "\n" +
            data.notificationSetDate.getHours() +
            ":" +
            data.notificationSetDate.getMinutes()}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Title:</Text>
        <Text style={styles.text}>{data.title}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Body:</Text>
        <Text style={styles.text}>
          {data.body.length > 50 ? "Too Long for preview" : data.body}
        </Text>
      </View>
      {/* <View style={styles.item}>
        <Icon
          name="pencil-outline"
          type="ionicon"
          color="#002D62"
          // size={25}
          onPress={async () => {
            // clearInterval(intervalId);
            await Notifications.cancelScheduledNotificationAsync(id);
            console.log("deleted: " + id);
            dispatch(actions.deleteReminder(id));
          }}
          // onLongPress={() => console.log("LON")}
        />
      </View> */}
      <View style={styles.item}>
        <Text style={styles.text}>Repeats Every:</Text>
        {/* <Text style={styles.text}>{data.seconds} secs</Text> */}
        <Text>sec: {data.repeat}</Text>
      </View>
      <View style={styles.item}>
        <Icon
          name="trash-outline"
          type="ionicon"
          color="#002D62"
          // size={25}
          onPress={async () => {
            // clearInterval(intervalId);
            await Notifications.cancelScheduledNotificationAsync(id);
            console.log("deleted: " + id);
            dispatch(actions.deleteReminder(id));
          }}
          // onLongPress={() => console.log("LON")}
        />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    flexDirection: "row",
    height: 80,
    borderRadius: 10,
  },
  item: {
    flex: 1,
    padding: 5,
    // left: 10,
    // backgroundColor: "yellow",
  },
  text: {
    fontSize: 14,
    fontFamily: "sans-serif-condensed",
  },
});
