import React, { useState, useRef, useReducer } from "react";
// import MapView, { Callout, Circle, Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Icon } from "react-native-elements";

import { initialState, actions, reducer } from "./state";
import PlusIconModal from "./components/firstPlus";
import GetInputModal from "./components/getInputModal";
import ReminderItem from "./components/eachReminer";

export default function App() {
  //for notifications. No idea how they work
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [cancle, setCancle] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  //other stuff
  const [state, dispatch] = useReducer(reducer, initialState);

  async function schedulePushNotification(title, body, time) {
    const notification = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: "goes here" },
      },
      trigger: {
        seconds: parseInt(time),
        repeats: true,
      },
    });
    return notification;
  }

  async function scheduleAndCancel(theNotificationId) {
    await Notifications.cancelScheduledNotificationAsync(theNotificationId);
  }

  if (state.allReminders.length === 0) {
    Notifications.cancelAllScheduledNotificationsAsync();
    return (
      <View style={styles.container}>
        <GetInputModal
          theVisible={state.showInputModal}
          dispatch={dispatch}
          actions={actions}
        />
        <PlusIconModal
          theVisible={state.showPlusModal}
          dispatch={dispatch}
          actions={actions}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <GetInputModal
        theVisible={state.showInputModal}
        dispatch={dispatch}
        actions={actions}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Reminders</Text>
      </View>
      <View style={styles.list}>
        <FlatList
          // style={styles.list}
          data={state.allReminders}
          keyExtractor={(rem) => rem.id}
          scrollEnabled
          renderItem={({ item }) => {
            // console.log(item);
            const index = state.allReminders.indexOf(item);
            return (
              <ReminderItem
                dispatch={dispatch}
                actions={actions}
                id={item.id}
                data={item.data}
                index={index}
              />
            );
          }}
        />
      </View>
      {state.showInputModal ? (
        <View />
      ) : (
        <View style={styles.lastRow}>
          <View style={{ flex: 1 }}>
            <Icon
              // style={{ flex: 1 }}
              name="add-outline"
              type="ionicon"
              color="#00BFFF"
              size={100}
              onPress={() => {
                dispatch(actions.setInputModal);
              }}
              // onLongPress={() => console.log("LON")}
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "red",
              borderRadius: 20,
              width: 110,
              textAlign: "center",
            }}
            onPress={() => {
              console.log("cancled all notifications");
              dispatch(actions.deleteAllReminders);
              Notifications.cancelAllScheduledNotificationsAsync();
            }}
          >
            <Text
              style={{
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Cancel all notifications
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00308F",
    alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    paddingTop: "10%",
  },
  headerText: {
    fontSize: 24,
    color: "#7FFFD4",
    fontFamily: "monospace",
  },
  lastRow: {
    flexDirection: "row",
    // top: "30%",
    // left: "40%",
  },
  list: {
    width: "100%",
    height: "70%",
    // backgroundColor: "blue",
  },
  scroller: {
    flex: 1,
  },
});
