import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
  YellowBox
} from 'react-native';
import { ListItem, Header } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as Permissions from 'expo-permissions';
import { connect } from 'react-redux';
import { logger } from 'react-native-logger';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';
import { IconButton, Banner } from 'react-native-paper';
import { fetchVisits, deleteVisit } from '../../redux/actions';
import styles from './styles';
import privacyPolicy from '../../assets/privacypolicy.json';

const swipePixelSize = 75;

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      refreshing: false,
      showBanner: false
    };

    YellowBox.ignoreWarnings([
      'Deprecation warning',
      'VirtualizedList',
      'Accessing view manager',
      'Warning:',
      'Possible'
    ]);
  }

  async componentDidMount() {
  }

  render() {
    return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        centerComponent={{ text: 'Settings', style: styles.headerCenter }}
      />
      </View>
    );
  }
}

export default (SettingsScreen);
