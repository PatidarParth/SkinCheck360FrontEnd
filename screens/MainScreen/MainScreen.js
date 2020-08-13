import React, { Component } from 'react';
import {
  Alert,
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
import {
  Auth, API, graphqlOperation, Storage
} from 'aws-amplify';
import { logger } from 'react-native-logger';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';
import { IconButton, Banner } from 'react-native-paper';
import styles from './styles';
import privacyPolicy from '../../assets/privacypolicy.json';
import {
  listByUserOrdered, deleteVisitEntry, deletePicture, createIsPrivatePolicyAccepted, checkIfPrivatePolicyAccepted
} from '../../graphQL/queries';

const swipePixelSize = 75;

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshing: false,
      showBanner: false,
      visitEntries: [],
      username: '',
      spinnerEnabled: true
    };

    YellowBox.ignoreWarnings([
      'Deprecation warning',
      'VirtualizedList',
      'Accessing view manager',
      'Warning:',
      'Possible',
      'Non-serializable values were found in the navigation state',
    ]);
  }


  componentDidMount = async () => {
    // graphql api call to fetch based on user
    const user = await Auth.currentAuthenticatedUser().catch();
    this.setState({ username: user.username });
    // fetch all entries
    await this.fetchVisitEntries();
    // Entries update on navaigation back to this page
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      await this.fetchVisitEntries();
    });
    this.setState({ spinnerEnabled: false });

    // check to see if privatePolicy is accepted
    const isPrivatePolicyAccepted = await API.graphql(graphqlOperation(checkIfPrivatePolicyAccepted, { username: this.state.username }));
    if (isPrivatePolicyAccepted.data.listIsPrivatePolicyAccepteds.items.length > 0) {
      this.accessCameraPermissions();
    } else {
      this.setState({ visible: true });
    }
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener();
  }


  acceptPrivacyPolicy = async () => {
    // eslint-disable-next-line max-len
    const checkIfPrivatePolicyAlreadySet = await API.graphql(graphqlOperation(checkIfPrivatePolicyAccepted, { username: this.state.username }));
    if (checkIfPrivatePolicyAlreadySet.data.listIsPrivatePolicyAccepteds.items.length === 0) {
      // eslint-disable-next-line max-len
      await API.graphql(graphqlOperation(createIsPrivatePolicyAccepted, { username: this.state.username, isPrivatePolicyAccepted: true }));
    }
    await this.setState({ visible: false });
    this.accessCameraPermissions();
  };

  showDeleteAlert = (visitEntry) => {
    if (visitEntry) {
      Alert.alert(
        'Delete Visit...',
        `Are you sure you want to delete the visit '${
          visitEntry.name
        }' on ${Moment(visitEntry.date,).format('MM/DD/YYYY')}`,
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => this.deleteVisitEntries(visitEntry.id)
          }
        ],
        { cancelable: false }
      );
    }
  };

  goToEdit = (rowMap, visitEntry) => {
    rowMap[visitEntry.id].closeRow();
    this.props.navigation.navigate('EditEvent', {
      ...visitEntry
    });
  }


  accessCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA
    ).catch((err) => logger.log('Unable to ask for camera permissions', err));
    this.setState({
      cameraPermission: status,
      showBanner: status === 'denied'
    });
  };

  fetchVisitEntries = async () => {
    const { username } = this.state;
    const visitEntries = await API.graphql(graphqlOperation(listByUserOrdered, { owner: username }));
    this.setState({ visitEntries: visitEntries.data.listByUserOrdered.items });
  }

  refreshVisitEntries = async () => {
    this.setState({ refreshing: true });
    this.fetchVisitEntries();
    this.setState({ refreshing: false });
  }

  deleteVisitEntries= async (visitEntryID) => {
    // eslint-disable-next-line no-shadow
    const visitEntryObject = this.state.visitEntries.find((visitEntryObject) => visitEntryObject.id === visitEntryID);
    const pictureItems = visitEntryObject.pictures.items;
    pictureItems.forEach(async (element) => {
      // delete from pictures
      await API.graphql(graphqlOperation(deletePicture, { pictureId: element.id }));
      // delete from s3
      await Storage.remove(`uploads/${visitEntryID}/${element.id}`);
      await Storage.remove(`anatomicOutline/${visitEntryID}/${element.id}.jpeg`);
    });
    // delete visit
    await API.graphql(graphqlOperation(deleteVisitEntry, { id: visitEntryID }));
    // fetch updated visits
    this.fetchVisitEntries();
  }

  render() {
    const { cameraPermission, visitEntries } = this.state;

    if (this.state.visible) {
      return (
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
      );
    }
    return (
      <View style={styles.container}>
        <Spinner
          // visibility of Overlay Loading Spinner
          visible={this.state.spinnerEnabled}
          // Text with the Spinner
          textContent="Logging you in"
          // Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
          overlayColor="gray"
          animation="fade"
        />
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

        {cameraPermission === 'granted' && (!visitEntries
              || (visitEntries && Object.keys(visitEntries).length === 0)) && (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollView}
                refreshControl={(
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshVisitEntries()}
                  />
                    )}
              >
                <View style={{
                  flex: 0.9, flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Text style={styles.notificationText}>
                    There are currently no visits entered.
                  </Text>
                </View>
              </ScrollView>
        )}
        {cameraPermission === 'granted' && visitEntries && (
        <SwipeListView
          refreshControl={(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.refreshVisitEntries()}
            />
              )}
          useFlatList
          data={visitEntries}
                // eslint-disable-next-line arrow-body-style
          keyExtractor={(rowData,) => {
            return rowData.id.toString();
          }}
          renderItem={(visitEntry) => (
            <ListItem
              title={visitEntry.item.name}
              subtitle={Moment(visitEntry.item.date).format(
                'MMMM D, YYYY'
              )}
              titleStyle={{ fontFamily: 'Avenir-Light', fontSize: 18, fontWeight: '600' }}
              subtitleStyle={{ fontFamily: 'Avenir-Light', fontSize: 14 }}
              bottomDivider
              chevron={{ color: '#00539B' }}
              onPress={() => this.props.navigation.navigate('VisitDescription', {
                ...visitEntry.item, username: this.state.username
              })}
            />
          )}
          renderHiddenItem={(visitEntry, rowMap) => (
            <View style={styles.rowBack}>
              <View style={styles.swipeView}>
                <TouchableOpacity
                  onPress={() => this.goToEdit(rowMap, visitEntry.item)}
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
                  onPress={() => this.showDeleteAlert(visitEntry.item)}
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
      </View>
    );
  }
}


export default MainScreen;
