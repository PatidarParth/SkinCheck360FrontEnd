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
      <HomeStack.Screen name="Home" component={MainScreen} options={{headerMode: 'none', headerShown : false}}/>
      <HomeStack.Screen name="AddEvent" component={AddEventScreen} options={{headerMode: 'none', headerShown : false}}/>
      <HomeStack.Screen name="Camera" component={CameraScreen} options={{headerMode: 'none', headerShown : false}}/>
      <HomeStack.Screen name="ViewPhoto" component={PhotoScreen} options={{headerMode: 'none', headerShown : false}}/>
      <HomeStack.Screen name="VisitDescription" component={VisitScreen} options={{headerMode: 'none', headerShown : false}} />
      <HomeStack.Screen name="EditEvent" component={EditEventScreen} options={{headerMode: 'none', headerShown : false}}/>
    </HomeStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      activeTintColor: '#0A2B66',
    }}>
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
      }} />
    </Tab.Navigator>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
