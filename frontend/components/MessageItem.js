import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MessageItem({ isSender, content, time }) {
  return (
    <View
      style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble,
      ]}
    >
      <Text style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}>
        {content}
      </Text>
      {time && (
        <Text style={[styles.timeText, isSender ? styles.senderTime : styles.receiverTime]}>
          {time}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  senderBubble: {
    backgroundColor: "#075E54",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  receiverBubble: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: "left",
  },
  senderText: {
    color: "#FFFFFF",
  },
  receiverText: {
    color: "#111B21",
  },
  timeText: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 2,
  },
  senderTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  receiverTime: {
    color: "#8696A0",
  },
});
