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

  async function scheduleAndCancel(theNotification) {
    await Notifications.cancelScheduledNotificationAsync(theNotification);
  }

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (state.allReminders.length === 0) {
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
        <View style={styles.plusIcon}>
          <Icon
            name="add-outline"
            type="ionicon"
            color="#002D62"
            size={100}
            onPress={() => {
              dispatch(actions.setInputModal);
            }}
            // onLongPress={() => console.log("LON")}
          />
        </View>
      )}
    </View>
  );

  {
    /* <TextInput
        keyboardType="numeric"
        style={styles.textInput}
        value={minutes}
        onChangeText={(text) => setMinutes(text)}
      />
      <Button
        title={sent}
        onPress={async () => {
          // Notifications.cancelAllScheduledNotificationsAsync();
          await schedulePushNotification("Vaheguru", "First", 10);
        }}
        icon={{
          name: "arrow-right",
          size: 15,
          color: "white",
        }}
      /> */
  }
  {
    /* <Button
        title={sent}
        onPress={async () => {
          // Notifications.cancelAllScheduledNotificationsAsync();
          const theCancle = await schedulePushNotification(
            "2Vaheguru",
            "Second",
            5
          );
          console.log(theCancle);
          setCancle(theCancle);
        }}
        icon={{
          name: "arrow-right",
          size: 15,
          color: "white",
        }}
      />
      <Button
        title="STOP"
        onPress={() => {
          console.log("Stop");
          console.log(cancle);
          scheduleAndCancel(cancle);
          Notifications.cancelAllScheduledNotificationsAsync();
        }}
      /> */
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8",
    alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    paddingTop: "10%",
  },
  headerText: {
    fontSize: 24,
  },
  plusIcon: {
    // top: "30%",
    // left: "40%",
  },
  list: {
    width: "95%",
    height: "70%",
    backgroundColor: "blue",
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

{
  /* <View style={{ alignItems: "center", justifyContent: "center" }}>
  <Text>
    <Text>Your expo push token: {expoPushToken}</Text>
    Title: {notification && notification.request.content.title}{" "}
  </Text>
  <Text>Body: {notification && notification.request.content.body}</Text>
  <Text>
    Data:{" "}
    {notification && JSON.stringify(notification.request.content.data)}
  </Text>
</View> */
}
