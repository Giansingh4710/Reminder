import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function GetInputModal({ theVisible, dispatch, actions }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [minutes, setMinutes] = useState("");
  const [disableSubmitButton, setSubmitButton] = useState(true);

  function fixSubmitButton() {
    if (title !== "" && body !== "" && minutes !== "") {
      setSubmitButton(false);
    }
  }
  useEffect(() => {
    if (title !== "" && body !== "" && minutes !== "") {
      setSubmitButton(false);
    } else {
      setSubmitButton(true);
    }
  }, [title, body, minutes]);

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
              placeholder="title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              style={styles.inputText}
            ></TextInput>
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
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.textDirection}>Repeat every: </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="60"
              value={minutes}
              onChangeText={(text) => {
                setMinutes(text);
              }}
              style={{ ...styles.inputText, width: "30%" }}
            ></TextInput>
            <Text style={styles.textDirection}> minutes</Text>
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
              setMinutes("");
              //   const theId = await schedulePushNotification(
              //     title,
              //     body,
              //     minutes
              //   );
              let theId = title;
              const dataForNotification = { title, body, minutes };
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
