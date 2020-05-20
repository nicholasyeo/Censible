import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "native-base/src/basic/Button";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "../Routes/TabNavigator";
import StackNavigator from "../Routes/StackNavigator";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  handleUsername = (text) => this.setState({ username: text });

  handlePassword = (text) => this.setState({ password: text });

  render() {
    const { username, password } = this.state;
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="grey"
          autoCapitalize="none"
          onChangeText={() => this.handleUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="grey"
          autoCapitalize="none"
          onChangeText={() => this.handlePassword}
        />
        <Button
          style={styles.button}
          onPress={() => this.props.navigation.navigate("HomeScreen")}
        >
          <Text> Login </Text>
        </Button>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginTop: 10,
    width: 200,
    height: 30,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 20,
  },
  button: {
    marginTop: 30,
  },
});
