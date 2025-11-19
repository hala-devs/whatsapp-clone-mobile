import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation";
export default function App() {
    return (
    <NativeBaseProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar backgroundColor="#0e896a" barStyle="light-content" />
          <View style={styles.container}>
            <Navigation/>
          </View>
        </SafeAreaView>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});