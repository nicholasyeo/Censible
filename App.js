import React from "react";
import { Spinner, Root } from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import TabNavigator from "./src/Routes/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./src/Routes/AuthStackNavigator";
import firebase from "./firebaseDb";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { store, persistor } from "./src/redux/store";

export default class App extends React.Component {
  unsubscribe = null;

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoading: true,
      userToken: null,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ isLoading: false });
    unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  }

  componentWillUnmount() {
    // Unsubscribe to the firebase auth listener when we have stopped using it
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner style={{ flex: 1 }} />;
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <NavigationContainer>
              {this.state.isLoggedIn ? (
                <TabNavigator />
              ) : (
                <AuthStackNavigator />
              )}
            </NavigationContainer>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}
