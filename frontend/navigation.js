import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login.js";        // ✅ أضف .js
import Register from "./screens/Register.js";  // ✅ أضف .js
import Home from "./screens/Home.js";          // ✅ أضف .js
import Messages from "./screens/Messages.js";  // ✅ أضف .js

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Messages" component={Messages}
      options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0e806a',
        },
        headerTitleStyle: {
          color: 'white',
        },
        headerTintColor: 'white',
      }}
      />
    </Stack.Navigator>
  );
}
