// App.js
/* eslint no-unused-vars: "off" */
import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Provider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { applyMiddleware, createStore } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet } from 'react-native';
import { SplashScreen } from 'expo';

import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { AppearanceProvider } from 'react-native-appearance';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import { I18n } from 'aws-amplify';
import MainScreen from './screens/MainScreen';
import AddEventScreen from './screens/AddEventScreen';
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';
import PhotoScreen from './screens/PhotoScreen';
import VisitScreen from './screens/VisitScreen';
import EditEventScreen from './screens/EditEventScreen';
import config from './aws-exports';


import rootReducer from './redux/rootReducer';

const authScreenLabels = {
  en: {
    'Sign in to your account': 'Welcome to Skin Check 360',
    'Create a new account': 'Join Skin Check 360'
    // 'Custom auth lambda trigger is not configured for the user pool': 'Password cannot be empty'
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

Amplify.configure(config);

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

class App extends React.Component {
  useEffect = () => {
    SplashScreen.true();
  };

  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppearanceProvider>
            <NavigationContainer>
              <MyTabs />
            </NavigationContainer>
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

const tabBarVisible = async (route) => {
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
          tabBarVisible: tabBarVisible(route)
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

const AmplifyTheme = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 100,
    width: '100%',
    backgroundColor: '#FFF',
  },
  section: {
    flex: 1,
    width: '100%',
    paddingTop: '40%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 32,
  },
  sectionScroll: {
    flex: 1,
    width: '100%',
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30
  },
  sectionHeaderText: {
    color: '#0A2B66',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  },
  sectionFooter: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 50,
  },
  sectionFooterLink: {
    fontSize: 14,
    color: '#0A2B66',
    alignItems: 'baseline',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  },
  sectionFooterLinkDisabled: {
    fontSize: 14,
    color: '#808080',
    alignItems: 'baseline',
    textAlign: 'center',
  },
  navBar: {
    marginTop: 1000,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: 12,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    width: '50%',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorRowText: {
    marginLeft: 10,
    fontFamily: 'Avenir-Light'
  },
  photo: {
    width: '100%',
  },
  album: {
    width: '100%',
  },
  button: {
    backgroundColor: '#0A2B66',
    alignItems: 'center',
    padding: 10
  },
  buttonDisabled: {
    backgroundColor: '#808080',
    alignItems: 'center',
    padding: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir-Light'
  },
  formField: {
    marginBottom: 22,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#0A2B66',
    fontFamily: 'Avenir-Light'
  },
  inputLabel: {
    marginBottom: 5,
    fontFamily: 'Avenir-Light',
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 2,
    padding: 12,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#0A2B66',
    fontFamily: 'Avenir-Light'
  },
  picker: {
    flex: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
  signedOutMessage: {
    display: 'none'
  }
});

const signUpConfig = {
  hideAllDefaults: false,
  signUpFields: [
    {
      label: 'Name',
      key: 'name',
      placeholder: 'Enter First and Last Name',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Username',
      key: 'username',
      placeholder: 'Enter Username',
      required: true,
      displayOrder: 2,
      type: 'string',
    },
    {
      label: 'Email',
      key: 'email',
      placeholder: 'Enter Email',
      required: true,
      displayOrder: 3,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      placeholder: 'Enter Password',
      required: true,
      displayOrder: 5,
      type: 'password',
    },
    {
      label: 'Address',
      key: 'address',
      placeholder: 'Enter Clinic Address',
      required: true,
      displayOrder: 6,
      type: 'address',
    }
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default withAuthenticator(App, false, [], null, AmplifyTheme, signUpConfig);
