import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Notifications from "expo-notifications";

import { Icon } from "react-native-elements";
export default function ReminderItem({ dispatch, actions, id, data, index }) {
  const [time, setTime] = useState(data.seconds);
  let countDown = useRef(data.seconds);
  let intervalId;
  const startTime = () => {
    intervalId = setInterval(() => {
      // setTime((prev) => prev - 1);
      countDown.current -= 1;
      setTime(countDown.current);
      if (countDown.current === 0) {
        countDown.current = data.seconds;
      }
    }, 1000);
  };
  useEffect(() => {
    startTime();
  }, []);

  return (
    <View
      style={
        index % 2 === 0
          ? styles.container
          : { ...styles.container, backgroundColor: "#7CB9E8" }
      }
    >
      <View style={styles.item}>
        <Text style={styles.text}>Title:</Text>
        <Text style={styles.text}>{data.title}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Body:</Text>
        <Text style={styles.text}>{data.body}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Repeats Every:</Text>
        {/* <Text style={styles.text}>{data.seconds} secs</Text> */}
        <Text>sec: {time}</Text>
      </View>
      <View style={styles.item}>
        <Icon
          name="trash-outline"
          type="ionicon"
          color="#002D62"
          size={25}
          onPress={async () => {
            // dispatch(actions.setInputModal);
            clearInterval(intervalId);
            await Notifications.cancelScheduledNotificationAsync(id);
            console.log("deleted: " + id);
            dispatch(actions.deleteReminder(id));
          }}
          // onLongPress={() => console.log("LON")}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    flexDirection: "row",
    height: 60,
    borderRadius: 10,
  },
  item: {
    flex: 1,
    padding: 15,
  },
  text: {
    fontSize: 14,
    fontFamily: "sans-serif-condensed",
  },
});
