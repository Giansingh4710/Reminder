import * as React from "react";
import { StyleSheet, View, Text } from "react-native";

import { Icon } from "react-native-elements";
export default function ReminderItem({ dispatch, actions, id, data, index }) {
  //   const styles = StyleSheet.create(theStyles);
  return (
    <View
      style={
        index % 2 === 0
          ? styles.container
          : { ...styles.container, backgroundColor: "#7CB9E8" }
      }
    >
      <View style={styles.item}>
        <Text>
          Title:
          {data.title}
        </Text>
      </View>
      <View style={styles.item}>
        <Text>Body: {data.body}</Text>
      </View>
      <View style={styles.item}>
        <Text>min: {data.minutes}</Text>
      </View>
      <View style={styles.item}>
        <Icon
          name="trash-outline"
          type="ionicon"
          color="#002D62"
          size={25}
          onPress={() => {
            // dispatch(actions.setInputModal);
            console.log("delete: " + id);
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
    height: 50,
  },
  item: {
    flex: 1,
  },
});
