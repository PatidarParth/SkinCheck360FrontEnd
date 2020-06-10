import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, ScrollView, Image
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
import { connect } from 'react-redux';
import { Appearance } from 'react-native-appearance';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { addVisit } from '../../redux/actions';
import styles from './styles';

const colorScheme = Appearance.getColorScheme();

class AddEventScreen extends Component {
  subscription;

  constructor(props) {
    super(props);
    this.state = {
      visitId: '',
      visitName: '',
      isDateTimePickerVisible: false,
      visitDate: Date.now(),
      visitNotes: '',
      edit: false,
      isDarkModeEnabled: colorScheme === 'light',
      visitTitleError: '',
      visitPictures: [],
      pictureNote: '',
      pictureLocation: '',
      pictureBodyPart: '',
      visible: false,
      x: 0,
      y: 0,
      selectedPicture: {},
      addNewMenuVisible: false
    };
  }

  componentDidMount() {
    this.setState({
      visitId: '',
      visitName: '',
      visitDate: Date.now(),
      visitNotes: '',
      edit: false,
    });

    // eslint-disable-next-line no-undef
    subscription = Appearance.addChangeListener(
      ({ colorScheme: _colorScheme }) => {
        this.setState({ isDarkModeEnabled: _colorScheme === 'light' });
      }
    );
  }

  componentDidUpdate = (oldProps) => {
    const newProps = this.props;
    let picId = newProps.navigation.getParam('picId')
    if (oldProps.navigation.getParam('pictureArray') !== newProps.navigation.getParam('pictureArray')) {
      if (newProps.navigation.getParam('pictureArray') !== undefined) {
          if (this.state.visitPictures.find(e => e.pictureId === picId)) {
            let updatedArray = update(this.state.visitPictures, {$splice: [[this.state.visitPictures.findIndex(e => e.pictureId === picId), 1, newProps.navigation.getParam('pictureArray')[0]]]});  // array.splice(start, deleteCount, item1)
            this.setState((prevState) => ({ visitPictures: updatedArray }));
          }
          else {
            this.state.visitPictures.push(newProps.navigation.getParam('pictureArray')[0]);
            this.setState((prevState) => ({ visitPictures: prevState.visitPictures }));
          }          
      }
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    if (subscription) subscription.remove();
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
    this.setState({ addNewMenuVisible: false });
    this.props.navigation.navigate('AddPhotos', {
      visitId: '',
    });
  };

  importImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ addNewMenuVisible: false });
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        exif: true
      });
      const emptyString = '';
      const location = -100;
      const diameter = 20;
      if (result && result.uri) {
        this.state.visitPictures.push({
          emptyString,
          uri: result.uri,
          emptyString,
          emptyString,
          emptyString,
          location,
          location,
          diameter,
          dateCreated: Moment().format('MM/DD/YYYY hh:mm A')
        });
        this.setState((prevState) => ({ visitPictures: prevState.visitPictures }));
      }
    }
  };

  saveVisit = async () => {
    if (this.state.visitName) {
      const id = this.state.edit ? this.state.visitId : uuidv4();
      this.props.addVisit(
        this.props.visitData,
        id,
        this.state.visitName,
        new Date(this.state.visitDate).toString(),
        this.state.visitNotes,
        this.state.visitPictures
      );

      this.props.navigation.navigate('Home');
    } else {
      this.setState(() => ({ visitTitleError: 'Visit Title is required.' }));
    }
  };

  displayDateTimePicker = (display) => this.setState({ isDateTimePickerVisible: display });

  view = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate('Photo', {
      visitId: '',
      pictureId: this.state.selectedPicture.pictureId,
      pictureUri: this.state.selectedPicture.uri,
      pictureNote: this.state.selectedPicture.pictureNote,
      pictureLocation: this.state.selectedPicture.pictureLocation,
      pictureBodyPart: this.state.selectedPicture.pictureBodyPart,
      visitPictures: this.state.visitPictures,
    });
  };

  overlayPicture = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate('AddPhotos', {
      visitId: '',
      overlayPictureId: this.state.selectedPicture.pictureId,
      visitPictures: this.state.visitPictures
    });
  };

  deletePicture = () => {
    this.setState({ visible: false });
    this.setState((prevState) => ({ visitPictures: prevState.visitPictures.filter((item) => item.uri !== prevState.pictureUri) }));
  };

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <KeyboardAwareScrollView>
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
        <View style={styles.innerSpacer}>
          <Input
            placeholder="The name of your doctor or hospital"
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
          <Text style={styles.errorFont}>
            {this.state.visitTitleError}
          </Text>
        </View>
        <View style={styles.inputSpacer}>
          <TouchableOpacity
            onPress={() => this.displayDateTimePicker(true)}
          >
            <Input
              placeholder="The date of the visit"
              label="Visit Date"
              labelStyle={styles.labelFont}
              color="#0A2B66"
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
            isDarkModeEnabled={this.state.isDarkModeEnabled}
          />
        </View>
        <View style={styles.innerSpacer}>
          <Input
            placeholder="Any notes about your visit"
            style={styles.flexGrow}
            label="Visit Information"
            labelStyle={styles.labelFont}
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
                  <View style={styles.innerSpacer}>
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
                    onPress={() => this.props.navigation.navigate('Photo', {
                      visitId: '',
                      pictureId: picture.pictureId,
                      pictureUri: picture.uri,
                      pictureNote: picture.pictureNote,
                      pictureLocation: picture.pictureLocation,
                      pictureBodyPart: picture.pictureBodyPart,
                      visitPictures: this.state.visitPictures
                    })}
                    onLongPress={(name) => {
                      this.setState({
                        x: name.nativeEvent.pageX,
                        y: name.nativeEvent.pageY,
                        selectedPicture: picture,
                        visitId: this.props.navigation.getParam('visitId'),
                        pictureUri: picture.uri,
                        pictureNote: picture.pictureNote,
                        pictureLocation: picture.pictureLocation,
                        pictureBodyPart: picture.pictureBodyPart,
                        visible: true
                      });
                    }}
                  >
                    <View
                      key={`picture-${picture.uri}`}
                      style={{ padding: 20, height: 200 }}
                    >
                      <Image
                        source={{ uri: picture.uri }}
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
            <Menu.Item onPress={() => this.view()} title="View" />
            <Divider />
            <Menu.Item onPress={this.overlayPicture} title="Overlay" />
            <Divider />
            <Menu.Item onPress={this.deletePicture} title="Delete" />
          </Menu>
        </Provider>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  visitData: state.visits.visits.visitData,
  visits: state.visits
});

const mapDispatchToProps = (dispatch) => ({
  addVisit: (visitData, id, name, created, information, pictures) => {
    dispatch(addVisit(visitData, id, name, created, information, pictures));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen);
