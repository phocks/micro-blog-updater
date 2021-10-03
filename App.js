import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import Octokat from "octokat";
import { API_URL, API_TOKEN } from "@env";

const octo = new Octokat({ token: API_TOKEN });
const repo = octo.repos("phocks", "phocks.vercel.app");

export default function App() {
  const [inputText, setInputText] = useState("");

  // useEffect(() => {
  //   repo
  //     .contents("public/feed.json")
  //     .fetch()
  //     .then(({ sha, content, ...info }) => {
  //       const decode = Buffer.from(content, "base64").toString("utf-8");
  //       console.log(decode);
  //     });
  // }, []);

  console.log(inputText);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Status update"
      />
      <Button
        title="Press me"
        onPress={() => {
          repo
            .contents("public/feed.json")
            .fetch()
            .then(({ sha, content, ...info }) => {
              const decode = Buffer.from(content, "base64").toString("utf-8");
              console.log(decode);

              const test = { id: "5" };
              console.log(`${JSON.stringify(test)}`);
            });
        }}
      />
      <StatusBar style="auto" />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
