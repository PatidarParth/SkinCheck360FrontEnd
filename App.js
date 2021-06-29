// App.js
/* eslint no-unused-vars: "off" */
import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CodePin from 'react-native-pin-code';

import { Provider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { applyMiddleware, createStore } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import {
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image
} from 'react-native';
import { SplashScreen } from 'expo';

import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { AppearanceProvider } from 'react-native-appearance';
import MainScreen from './screens/MainScreen';
import AddEventScreen from './screens/AddEventScreen';
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';
import PhotoScreen from './screens/PhotoScreen';
import VisitScreen from './screens/VisitScreen';
import EditEventScreen from './screens/EditEventScreen';

import rootReducer from './redux/rootReducer';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    createLogger() // neat middleware that logs actions
  )
);

const theme = {
  ...DefaultTheme,
  roundness: 6,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A2B66',
    accent: '#0A2B66'
  }
};

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      displayCodePin: true,
      success: ''
    };
  }

  useEffect = () => {
    SplashScreen.true();
  };

  onSuccess = () => {
    this.setState({ displayCodePin: false });
  }

  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppearanceProvider>
            {this.state.displayCodePin
                && (
                  <View style={styles.container}>
                    <Text style={styles.sectionText}>Skin Check 360</Text>
                    <Image
          // eslint-disable-next-line global-require
                      source={require('./assets/TransparentLogo.png')}
                      style={styles.logo}
                    />
                    <KeyboardAvoidingView
                      behavior="position"
                      keyboardVerticalOffset={-20}
                      contentContainerStyle={styles.avoidingView}
                    >
                      <CodePin
                        ref={(ref) => (this.ref = ref)}
                        obfuscation
                        text="Enter Pin Code"
                        error="Incorrect! Please try again."
                        autoFocusFirst
                        textStyle={styles.sectionFooterLabel}
                        errorStyle={styles.errorLabel}
                        code="fake_code"
                        number={7}
                        checkPinCode={(code, callback) => callback(code === 'SKIN360')}
                        success={this.onSuccess}
                      />
                    </KeyboardAvoidingView>
                  </View>
                )}
            {!this.state.displayCodePin
                && (
                <NavigationContainer>
                  <MyTabs />
                </NavigationContainer>
                )}
          </AppearanceProvider>
        </PaperProvider>
      </Provider>
    );
  }
}

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={MainScreen} options={{ headerMode: 'none', headerShown: false }} />
      <HomeStack.Screen name="AddEvent" component={AddEventScreen} options={{ headerMode: 'none', headerShown: false }} />
      <HomeStack.Screen name="Camera" component={CameraScreen} options={{ headerMode: 'none', headerShown: false }} />
      <HomeStack.Screen name="ViewPhoto" component={PhotoScreen} options={{ headerMode: 'none', headerShown: false }} />
      <HomeStack.Screen name="VisitDescription" component={VisitScreen} options={{ headerMode: 'none', headerShown: false }} />
      <HomeStack.Screen name="EditEvent" component={EditEventScreen} options={{ headerMode: 'none', headerShown: false }} />
    </HomeStack.Navigator>
  );
}

getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'Camera' || routeName === 'ViewPhoto') {
    return false;
  }

  return true;
};

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#0A2B66',
        labelStyle: {
          fontFamily: 'Avenir-Light',
          fontSize: 14
        }
      }}
    >
      <Tab.Screen
        name="Visits"
        component={HomeStackScreen}
        options={({ route }) => ({
          tabBarLabel: 'Visits',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          tabBarVisible: this.getTabBarVisibility(route)
        })}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelFont: {
    color: '#000000',
    fontSize: 12,
    padding: 2,
    fontWeight: 'normal',
    marginBottom: 5,
    fontFamily: 'Avenir-Light',
  },
  logo: {
    width: 80,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginBottom: 30,
    marginRight: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0A2B66',
    fontFamily: 'Avenir-Light',
  },
  sectionText: {
    color: '#0A2B66',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 5,
    fontFamily: 'Avenir-Light',
  },
  button: {
    backgroundColor: '#0A2B66',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    marginRight: 1,
    width: '85%'
  },
  disableButton: {
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    marginRight: 10,
    width: '85%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir-Light'
  },
  footerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10
  },
  signInButtonView: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionFooter: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    width: '50%',
  },
  sectionFooterLabel: {
    fontSize: 14,
    color: '#0A2B66',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
    paddingBottom: 5
  },
  errorLabel: {
    fontSize: 14,
    color: '#FF0000',
    alignItems: 'baseline',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  },
  termsLabel: {
    fontSize: 14,
    color: '#696969',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
  },
});
