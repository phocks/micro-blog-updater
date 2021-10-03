import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import dayjs from 'dayjs';
import GitHub from "github-api";
import { Buffer } from "buffer"


// Config
import { API_URL, API_TOKEN } from "@env";

// const octo = new Octokat({ token: API_TOKEN });
// const repo = octo.repos("phocks", "phocks.vercel.app");

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
          var gh = new GitHub({
            username: "phocks",
            token: API_TOKEN,
          });

          const repo = gh.getRepo("phocks", "phocks.vercel.app");
          // const branch = config.app.repoBranch;
          // const path = "README2.md";
          // const content = "#Foo Bar\nthis is foo bar";
          // const message = "add foo bar to the readme";
          // const options = {};

          // repo.writeFile(branch, path, content, message, options).then((r) => {
          //   console.log(r);
          // });

          const result = await repo.getContents(
            "main",
            "public/feed.json",
            false
          );

          console.log(result);

          // const result = await repo.contents("public/feed.json").fetch();
          const { sha, content, ...info } = result.data;

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
              // message: "Updating file",
              // content: Buffer.from(finalDocJSON).toString("base64"),
              sha: sha,
              // branch: 'gh-pages'
            };
            repo
              .writeFile(
                "main",
                "public/feed.json",
                finalDocJSON,
                "Updating file",
                config
              )

              .then((info) => {
                console.log("File Updated. info ", info);
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
