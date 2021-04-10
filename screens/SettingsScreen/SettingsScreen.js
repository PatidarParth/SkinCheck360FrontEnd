import React, { Component } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  View,
  YellowBox,
  Linking
} from 'react-native';
import { ListItem, Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import qs from 'qs';
import { IconButton } from 'react-native-paper';
import styles from './styles';
import privacyPolicy from '../../assets/privacypolicy.json';
import terms from '../../assets/terms.json';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyVisible: false,
      termsVisible: false
    };

    YellowBox.ignoreWarnings([
      'Deprecation warning',
      'VirtualizedList',
      'Accessing view manager',
      'Warning:',
      'Possible'
    ]);
  }

  getLegalPolicy = async (policyName) => {
    // private policy
    if (policyName === 'Privacy Policy') {
      this.setState({ privacyVisible: true });
    } else if (policyName === 'Terms & Conditions') {
      this.setState({ termsVisible: true });
    }
  };

  getSupport = async (supportNames) => {
    // Contact Us
    if (supportNames === 'Contact Us') {
      let url = 'mailto:pjpatidar16@gmail.com';

      // Create email link query
      const query = qs.stringify({
        subject: 'Skin Check 360 Feedback',
        body: '',
        cc: 'Pateljrp2@gmail.com'
      });

      if (query.length) {
        url += `?${query}`;
      }

      // check if we can use this link
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        throw new Error('Provided URL can not be handled');
      }

      return Linking.openURL(url);
    }
  };

  render() {
    const legalList = [
      {
        name: 'Privacy Policy',
        avatar_url: 'magnify'
      },
      {
        name: 'Terms & Conditions',
        avatar_url: 'card-bulleted'
      }
    ];

    return (
      <View>
        <Header
          containerStyle={styles.header}
          centerComponent={{ text: 'Settings', style: styles.headerCenter }}
        />
        {/* <View style={styles.notificationView}>
          <Text style={styles.labelFont}>LEGAL</Text>
          {
          legalList.map((l, i) => (
            <ListItem
              key={i}
              leftAvatar={(
                <MaterialCommunityIcons
                  name={l.avatar_url}
                  size={24}
                  style={styles.inputIcon}
                  color="#0A2B66"
                />
              )}
              title={l.name}
              bottomDivider
              titleStyle={{ fontFamily: 'Avenir-Light' }}
              onPress={() => this.getLegalPolicy(l.name)}
            />
          ))
        }
        </View> */}
        {/* <View style={styles.notificationView}>
          <Text style={styles.labelFont}>SUPPORT</Text>
          <ListItem
            key="contact-us"
            leftAvatar={(
              <MaterialCommunityIcons
                name="contact-phone"
                size={24}
                style={styles.inputIcon}
                color="#0A2B66"
              />
          )}
            title="Contact Us"
            titleStyle={{ fontFamily: 'Avenir-Light' }}
            bottomDivider
            onPress={() => this.getSupport('Contact Us')}
          />
        </View> */}

        {/* <View style={styles.notificationView}>
          <ListItem
            key="contact-us"
            leftAvatar={(
              <MaterialCommunityIcons
                name="contact-phone"
                size={24}
                style={styles.inputIcon}
                color="#0A2B66"
              />
          )}
            title="Contact Us"
            titleStyle={{ fontFamily: 'Avenir-Light' }}
            bottomDivider
            onPress={() => this.getSupport('Contact Us')}
          />
        </View> */}

        <Modal visible={this.state.privacyVisible}>
          <Header
            containerStyle={styles.header}
            leftComponent={(
              <IconButton
                icon="chevron-left"
                style={styles.leftHeaderComponent}
                color="white"
                size={40}
                onPress={() => this.setState({ privacyVisible: false })}
              />
                )}
            centerComponent={{ text: 'Privacy Notice', style: styles.headerCenter }}
          />
          <View style={styles.legalNoticeView}>
            <ScrollView style={styles.scrollView}>
              {privacyPolicy.policyLines.map((policyRow, i) => (
                <View key={`row-${i}`}>
                  <Text style={policyRow.style || styles.text}>
                    {policyRow.text}
                  </Text>
                  <Text />
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>

        <Modal visible={this.state.termsVisible}>
          <Header
            containerStyle={styles.header}
            leftComponent={(
              <IconButton
                icon="chevron-left"
                style={styles.leftHeaderComponent}
                color="white"
                size={40}
                onPress={() => this.setState({ termsVisible: false })}
              />
                )}
            centerComponent={{ text: 'Terms & Conditions', style: styles.headerCenter }}
          />
          <View style={styles.legalNoticeView}>
            <ScrollView style={styles.scrollView}>
              {terms.termsLines.map((termsRow, i) => (
                <View key={`row-${i}`}>
                  <Text style={termsRow.style || styles.text}>
                    {termsRow.text}
                  </Text>
                  <Text />
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

export default (SettingsScreen);
