import * as React from "react";
// import MapView, { Callout, Circle, Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Button, Switch } from "react-native-elements";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

// const Khajana = require("khajana");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] = React.useState(false);
  const [minutes, setMinutes] = React.useState("10");
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

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

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ਵਾਹਿਗੁਰੂ",
        body: "NAAM JAPO",
        data: { data: "goes here" },
      },
      trigger: {
        seconds: parseInt(minutes),
        repeats: true,
      },
    });
  }

  const sent =
    "Press to schedule the notification every " + minutes + " minutes";
  return (
    <View style={styles.container}>
      <TextInput
        keyboardType="numeric"
        style={styles.textInput}
        value={minutes}
        onChangeText={(text) => setMinutes(text)}
      />
      <Button
        title={sent}
        onPress={async () => {
          Notifications.cancelAllScheduledNotificationsAsync();
          await schedulePushNotification();
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
          Notifications.cancelAllScheduledNotificationsAsync();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: "yellow",
  },
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
