import { View, Text, Image, Button, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Community() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1 }}>
            <Image
                source={require("../assets/logo.png")}
                style={styles.image}
            />
            <Text style={styles.text}>Welcome to Chat App</Text>
            <Button 
                title="Go to Chat"
                onPress={() => {
                    navigation.navigate("Chat");
                }}
            />
            <View style={{ flex: 3 }} />
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  image: {
    transform: [{ scale: 0.75 }]
  },
  text: {
    fontSize: 32,
    margin: 20
  }
});