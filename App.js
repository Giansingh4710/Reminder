import React, { useState, useRef, useReducer, useEffect } from "react";
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
  StatusBar,
  Button,
} from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Icon } from "react-native-elements";

import { initialState, actions, reducer } from "./state";
import PlusIconModal from "./components/firstPlus";
import GetInputModal from "./components/getInputModal";
import ReminderItem from "./components/eachReminer";
import RandomShabad from "./components/randomGurbani";
import SunTimes from "./getSunStuffModal";

export default function App() {
  //other stuff
  const [state, dispatch] = useReducer(reducer, initialState);
  const [shabadModal, setShabadModal] = useState(false);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // console.log("res", response);
        let dateObj = new Date(response.notification.date * 1000);
        console.log(dateObj);
        let utcString = dateObj.toUTCString();
        console.log(utcString);
      }
    );
    return () => subscription.remove();
  });

  const SunStuff = <SunTimes location={state.locationForSun} />;

  if (state.allReminders.length === 0) {
    Notifications.cancelAllScheduledNotificationsAsync();
    return (
      <View style={styles.container}>
        <GetInputModal
          theVisible={state.showInputModal}
          dispatch={dispatch}
          actions={actions}
        />
        <PlusIconModal dispatch={dispatch} actions={actions} />
        {SunStuff}
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
        {SunStuff}
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
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              console.log("cancled all notifications");
              dispatch(actions.deleteAllReminders);
              Notifications.cancelAllScheduledNotificationsAsync();
            }}
          >
            <Icon
              // style={{ flex: 1 }}
              name="close-outline"
              type="ionicon"
              color="#7FFFD4"
              size={100}
              onPress={() => {
                dispatch(actions.setInputModal);
              }}
              // onLongPress={() => console.log("LON")}
            />
            <Text style={styles.bottomRowText}>Cancel all notifications</Text>
          </TouchableOpacity>
          <View style={styles.icon}>
            <Icon
              // style={{ flex: 1 }}
              name="add-outline"
              type="ionicon"
              color="#7FFFD4"
              size={100}
              onPress={() => {
                dispatch(actions.setInputModal);
              }}
              // onLongPress={() => console.log("LON")}
            />
            <Text style={styles.bottomRowText}>Add some new notifications</Text>
          </View>
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
  getShabad: {
    top: "5%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6495ED",
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
  icon: {
    flex: 1,
    backgroundColor: "#00BFFF",
    borderRadius: 20,
  },
  cancel: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 20,
    // width: 110,
    textAlign: "center",
  },
  bottomRowText: {
    textAlign: "center",
    fontFamily: "monospace",
  },
});
