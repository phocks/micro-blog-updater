import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import Octokat from "octokat";
import * as dayjs from "dayjs";

// Config
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
        onPress={async () => {
          const result = await repo.contents("public/feed.json").fetch();
          const { sha, content, ...info } = result;

          const decodedContent = Buffer.from(content, "base64").toString(
            "utf-8"
          );
          const parsedContent = JSON.parse(decodedContent);
          const { items } = parsedContent;

          const latestUpdate = items[0];
          const { id } = latestUpdate;

          const newUpdate = {
            id: (parseInt(id) + 1).toString(),
            date_published: dayjs().format(),
            content_text: inputText,
          };

          const newItems = [newUpdate, ...items];
          console.log(newItems);

          parsedContent.items = newItems;

          const finalDocument = { ...parsedContent, items: newItems };

          console.log(finalDocument);
          const finalDocJSON = JSON.stringify(finalDocument, null, 2);

          if (inputText !== "") {
            var config = {
              message: "Updating file",
              content: Buffer.from(finalDocJSON).toString("base64"),
              sha: sha,
              // branch: 'gh-pages'
            };

            repo
              .contents("public/feed.json")
              .add(config)
              .then(({ sha, ...info }) => {
                console.log("File Updated. new sha is ", sha);
              });
          }
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
