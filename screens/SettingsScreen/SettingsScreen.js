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

    const legalList = [
      {
        name: 'Privacy',
        avatar_url: "magnify"
      },
      {
        name: 'Terms',
        avatar_url: "card-bulleted"
      }
    ]

    return (
      <View >
      <Header
        containerStyle={styles.header}
        centerComponent={{ text: 'Settings', style: styles.headerCenter }}
      />
      <View style={styles.notificationView}>
      <Text style={styles.labelFont}>LEGAL</Text>
        {
          legalList.map((l, i) => (
            <ListItem
              key={i}
              leftAvatar = {(
                <MaterialCommunityIcons
                  name={l.avatar_url}
                  size={24}
                  style={styles.inputIcon}
                  color="#0A2B66"
                />
              )}
              title={l.name}
              bottomDivider
            />
          ))
        }
      </View>
      <View style={styles.notificationView}>
      <Text style={styles.labelFont}>SUPPORT</Text>
        <ListItem
          key='contact-us'
          leftAvatar = {(
            <MaterialCommunityIcons
              name="contact-phone"
              size={24}
              style={styles.inputIcon}
              color="#0A2B66"
            />
          )}
          title="Contact Us"
          bottomDivider
            />
        
      </View>
      </View>
    );
  }
}

export default (SettingsScreen);
