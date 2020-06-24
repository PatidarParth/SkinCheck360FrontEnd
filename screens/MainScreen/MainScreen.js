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
  YellowBox,
  Linking
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

class MainScreen extends Component {
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
    const privacyPolicyAccepted = await AsyncStorage.getItem(
      'privacyPolicy'
    ).catch((err) => logger.log('could not receive privacy policy', err));
    this.setState({ visible: !privacyPolicyAccepted });

    if (privacyPolicyAccepted) {
      this.accessCameraPermissions();
    }
    this.props.getVisits();
  }

  acceptPrivacyPolicy = async () => {
    await AsyncStorage.setItem('privacyPolicy', 'true');
    await this.setState({ visible: false });
    this.accessCameraPermissions();
  };

  showDeleteAlert = (key) => {
    const visitInfo = this.props.visitData[key];

    if (visitInfo) {
      Alert.alert(
        'Delete Visit...',
        `Are you sure you want to delete the visit '${
          visitInfo.visitName
        }' on ${Moment(visitInfo.visitDate,).format('MM/DD/YYYY')}`,
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => this.props.deleteVisit(this.props.visitData, key)
          }
        ],
        { cancelable: false }
      );
    }
  };

  accessCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA
    ).catch((err) => logger.log('Unable to ask for camera permissions', err));
    this.setState({
      cameraPermission: status,
      showBanner: status === 'denied'
    });
  };

  render() {
    const { cameraPermission } = this.state;
    const { visitData } = this.props;

    return (
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          centerComponent={{ text: 'All Visits', style: styles.headerCenter }}
          rightComponent={(
            <IconButton
              icon="plus"
              style={styles.rightHeaderComponent}
              color="white"
              size={30}
              onPress={() => {
                this.props.navigation.navigate('AddEvent');
              }}
            />
          )}
        />

        <Modal visible={this.state.visible}>
          <View style={styles.privacyNoticeView}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.textHeader}>Privacy Notice</Text>
              {privacyPolicy.policyLines.map((policyRow, i) => (
                <View key={`row-${i}`}>
                  <Text style={policyRow.style || styles.text}>
                    {policyRow.text}
                  </Text>
                  <Text />
                </View>
              ))}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => this.acceptPrivacyPolicy()}
              >
                <Text style={styles.primaryText}>ACCEPT</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {cameraPermission === 'denied' && (
          <Banner
            visible={this.state.showBanner}
            actions={[
              {
                label: 'Go to Settings',
                onPress: () => Linking.openURL('app-settings:')
              }
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: 'Avenir-Light' }}>
              The camera policy has been declined. Please turn on camera in your settings to continue using this app.
            </Text>
          </Banner>
        )}

        {cameraPermission === 'granted' && (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={(
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.props.getVisits}
              />
            )}
          >
            {(!visitData
              || (visitData && Object.keys(visitData).length === 0)) && (
              <View style={styles.visitOuterView}>
                <View style={styles.visitInnerView}>
                  <MaterialCommunityIcons
                    size={40}
                    name="calendar-remove"
                    style={{ paddingTop: 20 }}
                  />
                  <Text style={styles.notificationText}>
                    There are no visits entered
                  </Text>
                </View>
              </View>
            )}
            {visitData && (
              <SwipeListView
                data={Object.keys(visitData)}
                keyExtractor={(item) => item}
                renderItem={(key) => (
                  <ListItem
                    title={visitData[key.item].visitName}
                    subtitle={Moment(visitData[key.item].visitDate).format(
                      'MMMM D, YYYY'
                    )}
                    titleStyle={{ fontFamily: 'Avenir-Light', fontSize: 18, fontWeight: '600' }}
                    subtitleStyle={{ fontFamily: 'Avenir-Light', fontSize: 14 }}
                    bottomDivider
                    chevron={{ color: '#00539B' }}
                    onPress={() => this.props.navigation.navigate('VisitDescription', {
                      ...visitData[key.item], length: visitData[key.item].visitPictures.length,
                    })}
                  />
                )}
                renderHiddenItem={(key) => (
                  <View style={styles.rowBack}>
                    <View style={styles.swipeView}>
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('EditEvent', {
                          ...visitData[key.item]
                        })}
                        style={styles.leftSwipe}
                      >
                        <MaterialCommunityIcons
                          color="white"
                          size={30}
                          style={styles.leftSwipeIcon}
                          name="square-edit-outline"
                          backgroundColor="#00539B"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.rightSwipeView}>
                      <TouchableOpacity
                        onPress={() => this.showDeleteAlert(key.item)}
                        style={styles.rightSwipe}
                      >
                        <MaterialCommunityIcons
                          color="white"
                          size={30}
                          name="trash-can-outline"
                          backgroundColor="#00539B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                leftOpenValue={swipePixelSize}
                rightOpenValue={-swipePixelSize}
              />
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  visitData: state.visits.visits.visitData,
  visits: state.visits
});

const mapDispatchToProps = (dispatch) => ({
  getVisits: () => {
    dispatch(fetchVisits());
  },
  deleteVisit: (visits, visitId) => {
    dispatch(deleteVisit(visits, visitId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
