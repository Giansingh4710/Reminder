import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export default function GetInputModal({ theVisible, dispatch, actions }) {
  //for notifications. No idea how they work
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  //other stuff
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [seconds, setSeconds] = useState("");
  const [disableSubmitButton, setSubmitButton] = useState(true);

  //for notifications
  useEffect(() => {
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

  //makes submit button clickable or not
  useEffect(() => {
    if (title !== "" && body !== "" && seconds !== "") {
      setSubmitButton(false);
    } else {
      setSubmitButton(true);
    }
  }, [title, body, seconds]);

  async function getGubaniJi() {
    console.log("in gurbanuJi func");
    // const a =
    let shabad = "";
    await fetch("https://api.gurbaninow.com/v2/shabad/random")
      .then((res) => res.json())
      .then((resJson) => {
        const shabadOLstbj = resJson.shabad;
        for (const index in shabadOLstbj) {
          const gurmukhi = shabadOLstbj[index].line.larivaar.unicode;
          const translation =
            shabadOLstbj[index].line.translation.english.default;
          shabad += gurmukhi + "\n" + translation + "\n";
        }
      });
    // console.log(shabad);
    return shabad;
  }
  async function schedulePushNotification(title, body, time) {
    let notification;
    // console.log(body.toLowerCase());
    // console.log(body.toLowerCase() === "gurbaniji");
    if (body.toLowerCase() === "gurbaniji") {
      // console.log(await getGubaniJi());
      notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: await getGubaniJi(),
          data: { data: "goes here" },
        },
        trigger: {
          seconds: parseInt(time),
          repeats: true,
        },
      });
    } else {
      notification = await Notifications.scheduleNotificationAsync({
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
    }
    return notification;
  }

  return (
    <Modal transparent animationType="slide" visible={theVisible}>
      <View style={styles.modalContainer}>
        <Text style={styles.direction}>
          Enter the details for the type of Notifications you want to recive
        </Text>
        <View style={styles.allInputs}>
          <View style={styles.inputRow}>
            <Text style={styles.textDirection}>Title: </Text>
            <TextInput
              autoFocus
              placeholder="title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              style={styles.inputText}
            ></TextInput>
            <TouchableOpacity
              style={styles.gurbaniJi}
              onPress={() => {
                setTitle("ਵਾਹਿਗੁਰੂ");
              }}
            >
              <Text style={styles.suggetion}>ਵਾਹਿਗੁਰੂ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.textDirection}>Body: </Text>
            <TextInput
              placeholder="body"
              value={body}
              onChangeText={(text) => {
                setBody(text);
              }}
              style={styles.inputText}
            ></TextInput>
            <TouchableOpacity
              style={styles.gurbaniJi}
              onPress={() => {
                setBody("GurbaniJi");
              }}
            >
              <Text style={styles.suggetion}>GurbaniJi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.textDirection}>Repeat every: </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="60"
              value={seconds}
              onChangeText={(text) => {
                setSeconds(text);
              }}
              style={{ ...styles.inputText, width: "30%" }}
            ></TextInput>
            <Text style={styles.textDirection}> seconds</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            onPress={() => {
              dispatch(actions.setInputModal);
            }}
            style={styles.cancle}
          >
            <Text style={styles.text}>CANCLE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disableSubmitButton}
            onPress={async () => {
              setTitle("");
              setBody("");
              setSeconds("");
              const theId = await schedulePushNotification(
                title,
                body,
                seconds
              );
              // let theId = title;
              const dataForNotification = {
                title,
                body,
                seconds: parseInt(seconds),
              };
              dispatch(
                actions.addReminder({ id: theId, data: dataForNotification })
              );
              dispatch(actions.setInputModal);
            }}
            style={
              disableSubmitButton
                ? { ...styles.submit, backgroundColor: "rgba(124,185,232,0.4)" }
                : styles.submit
            }
          >
            <Text style={styles.text}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    width: "80%",
    left: "10%",
    height: "60%",
    top: "15%",
    borderRadius: 20,
    elevation: 20,
  },
  direction: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
    // backgroundColor: "blue",
  },
  allInputs: {
    flex: 3,
    // backgroundColor: "yellow",
  },
  inputRow: {
    // flex: 1,
    flexDirection: "row",
    margin: 10,
    // backgroundColor: "blue",
  },
  textDirection: {
    // flex: 1,
  },
  inputText: {
    width: "60%",
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    textAlign: "center",
  },
  gurbaniJi: {
    backgroundColor: "#7FFFD4",
    borderRadius: 20,
    width: 52,
    textAlignVertical: "bottom",
  },
  suggetion: {
    fontSize: 10,
    textAlign: "center",
    textAlignVertical: "bottom",
  },
  bottomRow: {
    flexDirection: "row",
  },
  cancle: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 20,
    margin: 20,
  },
  submit: {
    flex: 1,
    backgroundColor: "rgba(124,185,232,1)",
    borderRadius: 20,
    margin: 20,
  },
  text: {
    textAlign: "center",
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
