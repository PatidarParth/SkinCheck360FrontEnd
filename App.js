// App.js
/* eslint no-unused-vars: "off" */
import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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
import MainScreen from './screens/MainScreen';
import AddEventScreen from './screens/AddEventScreen';
import CameraScreen from './screens/CameraScreen';
import PhotosScreen from './screens/PhotosScreen';
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
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A2B66',
    accent: '#0A2B66'
  }
};

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  useEffect = () => {
    SplashScreen.true();
  };

  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppearanceProvider>
            <AppContainer/>
            <NavigationContainer>
              <MyTabs />
            </NavigationContainer>
          </AppearanceProvider>
        </PaperProvider>
      </Provider>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: MainScreen
    },
    AddEvent: {
      screen: AddEventScreen
    },
    AddPhotos: {
      screen: CameraScreen
    },
    Photos: {
      screen: PhotosScreen
    },
    Photo: {
      screen: PhotoScreen
    },
    VisitDescription: {
      screen: VisitScreen
    },
    EditEvent: {
      screen: EditEventScreen
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const AppContainer = createAppContainer(AppNavigator);

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Settings" component={MainScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
