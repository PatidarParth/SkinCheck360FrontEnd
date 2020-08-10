import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, ScrollView, Image, YellowBox
} from 'react-native';
import { Input, Header } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  IconButton, Provider, Menu, Divider
} from 'react-native-paper';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';
import update from 'immutability-helper';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import styles from './styles';
import { newVisitEntry, createPicture } from '../../graphQL/queries';

class AddEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitName: '',
      isDateTimePickerVisible: false,
      visitDate: Date.now(),
      visitNotes: '',
      visitTitleError: '',
      visitPictures: [],
      visible: false,
      x: 0,
      y: 0,
      selectedPicture: {},
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

  componentDidMount() {
  }

  componentDidUpdate = (oldProps) => {
    const newProps = this.props;
    if (oldProps.route.params?.pictureUri !== newProps.route.params?.pictureUri) {
      this.deletePicture(newProps.route.params?.pictureUri);
    } else if (oldProps.route.params?.pictureArray !== newProps.route.params?.pictureArray) {
      if (newProps.route.params?.pictureArray !== undefined && newProps.route.params?.pictureArray.length > 0) {
        // edit the pic with new pic
        if (this.state.visitPictures.find((e) => e.id === newProps.route.params?.picId)) {
          const updatedArray = update(
            this.state.visitPictures, {
              $splice: [[this.state.visitPictures.findIndex((e) => e.id === newProps.route.params?.picId), 1,
                newProps.route.params?.pictureArray[0]]]
            }
          ); // array.splice(start, deleteCount, item1)
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(() => ({ visitPictures: updatedArray }));
        // new pic first time
        } else {
          this.state.visitPictures.push(newProps.route.params?.pictureArray[0]);
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState((prevState) => ({ visitPictures: prevState.visitPictures }));
        }
      }
    }
  }

  handleDatePicked = (dateTime) => {
    this.displayDateTimePicker(false);
    this.setState({ visitDate: dateTime });
  };

  getDate = () => {
    if (this.state.visitDate) {
      return Moment(this.state.visitDate).format('MMMM D, YYYY');
    }
    return Moment().format('MMMM D, YYYY');
  };

  navigateToCamera = () => {
    this.props.navigation.navigate('Camera', {
      visitId: '',
    });
  };

  importImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        exif: true
      });
      if (result && result.uri) {
        this.state.visitPictures.push({
          id: uuidv4(),
          uri: result.uri,
          note: '',
          location: '',
          bodyPart: '',
          locationX: -100,
          locationY: -100,
          diameter: 20,
          dateCreated: Moment().format('MM/DD/YYYY hh:mm A'),
          faceDetectedValues: '[]'
        });
        this.setState((prevState) => ({ visitPictures: prevState.visitPictures }));
      }
    }
  };

  saveVisit = async () => {
    if (this.state.visitName) {
      // upload the visit Entry
      // eslint-disable-next-line max-len
      const visitId = await API.graphql(graphqlOperation(newVisitEntry, { name: this.state.visitName, date: Moment(this.state.visitDate).format('YYYY-MM-DDThh:mm:ss.sssZ'), notes: this.state.visitNotes }));
      const { visitPictures } = this.state;
      // upload each picture to s3
      visitPictures.forEach(async (element) => {
        this.storeVisitPhotoInfo(`uploads/${visitId.data.createVisitEntry.id}/${element.id}`, element, visitId.data.createVisitEntry.id);
        const response = await fetch(element.uri);
        const blob = await response.blob();
        await Storage.put(
          `uploads/${visitId.data.createVisitEntry.id}/${element.id}`,
          blob,
          {
            contentType: 'image/jpeg',
            metadata: { visitEntryId: visitId.data.createVisitEntry.id }
          }
        );
      });
      this.props.navigation.navigate('Home');
    } else {
      this.setState(() => ({ visitTitleError: 'Visit Title is required.' }));
    }
  };

  storeVisitPhotoInfo = (S3key, item, visitEntryId) => {
    if (item.faceDetectedValues !== '[]') {
      API.graphql(graphqlOperation(createPicture, {
        // eslint-disable-next-line max-len
        leftEarXPosition: item.faceDetectedValues.leftEarXPosition, leftEarYPosition: item.faceDetectedValues.leftEarYPosition, rightEarXPosition: item.faceDetectedValues.rightEarXPosition, rightEarYPosition: item.faceDetectedValues.rightEarYPosition, noseBaseXPosition: item.faceDetectedValues.noseBaseXPosition, noseBaseYPosition: item.faceDetectedValues.noseBaseYPosition, key: S3key, pictureSize: 600, pictureId: item.id, pictureNote: item.note, pictureLocation: item.location, pictureBodyPart: item.bodyPart, picturelocationX: item.locationX, picturelocationY: item.locationY, pictureDiameter: item.diameter, pictureVisitEntryId: visitEntryId, bucket: 'skincheck360images205534-dev'
      }));
    } else {
      const faceDetectedValue = 0;
      API.graphql(graphqlOperation(createPicture, {
        // eslint-disable-next-line max-len
        leftEarXPosition: faceDetectedValue, leftEarYPosition: faceDetectedValue, rightEarXPosition: faceDetectedValue, rightEarYPosition: faceDetectedValue, noseBaseXPosition: faceDetectedValue, noseBaseYPosition: faceDetectedValue, key: S3key, pictureSize: 600, pictureId: item.id, pictureNote: item.note, pictureLocation: item.location, pictureBodyPart: item.bodyPart, picturelocationX: item.locationX, picturelocationY: item.locationY, pictureDiameter: item.diameter, pictureVisitEntryId: visitEntryId, bucket: 'skincheck360images205534-dev'
      }));
    }
  };

  displayDateTimePicker = (display) => this.setState({ isDateTimePickerVisible: display });

  viewIndividualPhoto = (picture) => {
    this.setState({ visible: false });
    this.props.navigation.navigate('ViewPhoto', {
      visitId: '',
      currentPicture: picture,
      visitPictures: this.state.visitPictures
    });
  };

  overlayPicture = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate('Camera', {
      visitId: '',
      overlayPicture: this.state.selectedPicture,
      visitPictures: this.state.visitPictures
    });
  };

  deletePicture = (pictureUri) => {
    this.setState({ visible: false });
    this.setState((prevState) => ({ visitPictures: prevState.visitPictures.filter((item) => item.uri !== pictureUri) }));
  };

  render() {
    return (
      <View style={styles.providerView}>
        <Header
          containerStyle={styles.header}
          leftComponent={(
            <IconButton
              icon="chevron-left"
              style={styles.leftHeaderComponent}
              color="white"
              size={40}
              onPress={() => this.props.navigation.goBack()}
            />
          )}
          centerComponent={{ text: 'Enter Visit Information', style: styles.headerCenter }}
        />
        <KeyboardAwareScrollView>
          <View style={styles.innerSpacer}>
            <Input
              placeholder="The name of your doctor or hospital"
              errorStyle={{ color: 'red' }}
              inputStyle={styles.inputFont}
              errorMessage={this.state.visitTitleError}
              style={styles.flexGrow}
              label="Visit Title"
              labelStyle={styles.labelFont}
              leftIcon={(
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={24}
                  style={styles.inputIcon}
                  color="#0A2B66"
                />
            )}
              onChangeText={(text) => {
                this.setState({ visitName: text });
              }}
              value={this.state.visitName}
            />
          </View>
          <View style={styles.innerSpacer}>
            <TouchableOpacity
              onPress={() => this.displayDateTimePicker(true)}
            >
              <Input
                placeholder="The date of the visit"
                label="Visit Date"
                labelStyle={styles.labelFont}
                inputStyle={styles.inputFont}
                editable={false}
                value={this.getDate()}
                style={styles.inputTimePicker}
                leftIcon={(
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    style={styles.inputIcon}
                    color="#0A2B66"
                  />
              )}
              />
            </TouchableOpacity>
            <DateTimePicker
              value={this.state.visitDate}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={() => this.displayDateTimePicker(false)}
            />
          </View>
          <View style={styles.innerSpacer}>
            <Input
              placeholder="Any notes about your visit"
              style={styles.flexGrow}
              label="Visit Information"
              labelStyle={styles.labelFont}
              inputStyle={styles.inputFont}
              multiline
              leftIcon={(
                <MaterialCommunityIcons
                  name="pen"
                  size={24}
                  style={styles.inputIcon}
                  color="#0A2B66"
                />
            )}
              onChangeText={(text) => {
                this.setState({ visitNotes: text });
              }}
              value={this.state.visitNotes}
            />
          </View>
          <Provider>
            <ScrollView>
              {(!this.state.visitPictures
                || (this.state.visitPictures && this.state.visitPictures.length === 0)) && (
                  <View style={styles.inputSpacer}>
                    <View style={styles.notificationView}>
                      <Text style={styles.notificationText}>
                        No Pictures Currently
                      </Text>
                    </View>
                  </View>
              )}
              <View style={styles.scrollView}>
                {this.state.visitPictures
                && this.state.visitPictures.length > 0
                && this.state.visitPictures.map((picture, i) => (
                  <TouchableOpacity
                    key={`picture-${i}`}
                    style={styles.pictureButton}
                    onPress={() => this.viewIndividualPhoto(picture)}
                    onLongPress={(name) => {
                      this.setState({
                        x: name.nativeEvent.pageX,
                        y: name.nativeEvent.pageY,
                        selectedPicture: picture,
                        pictureUri: picture.uri,
                        visible: true
                      });
                    }}
                  >
                    <View
                      key={`picture-${picture.uri}`}
                      style={{ padding: 20, height: 200 }}
                    >
                      <Image
                        source={{ uri: `${picture.uri}` }}
                        style={{ height: '100%', width: '100%' }}
                      />
                      <Text style={styles.pictureFont}>{picture.dateCreated}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputSpacer}>
                <View style={styles.photoButtonRow}>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={this.navigateToCamera}
                  >
                    <Text style={styles.primaryText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={this.importImage}
                  >
                    <Text style={styles.primaryText}>Import Image </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonSave}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => this.saveVisit()}
                >
                  <Text style={styles.primaryText}>Save Visit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <Menu
              visible={this.state.visible}
              onDismiss={() => this.setState({ visible: false })}
              anchor={{ x: this.state.x, y: this.state.y }}
            >
              <Menu.Item onPress={() => this.viewIndividualPhoto(this.state.selectedPicture)} title="View" />
              <Divider />
              <Menu.Item onPress={this.overlayPicture} title="Photo Overlay" />
              <Divider />
              <Menu.Item onPress={() => this.deletePicture(this.state.pictureUri)} title="Delete" />
            </Menu>
          </Provider>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


export default AddEventScreen;
