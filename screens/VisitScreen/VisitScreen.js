// Aboutscreen.js
import React, { Component } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import {
  Menu, Divider, Provider, IconButton
} from 'react-native-paper';
import { connect } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';
import { deletePicture, addPicture } from '../../redux/actions';
import styles from './styles';

class VisitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitId: '',
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
    FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`).catch(() => {
    });
    this.setState({ visitId: this.props.route.params?.visitId });
  }

  view = () => {
    this.setState({ visible: false });

    this.props.navigation.navigate('ViewPhoto', {
      visitId: this.state.visitId,
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
    this.props.navigation.navigate('Camera', {
      visitId: this.state.visitId,
      overlayPictureId: this.state.selectedPicture.pictureId
    });
  };

  deletePicture = () => {
    this.props.deletePicture(
      this.props.visitData,
      this.state.visitId,
      this.state.pictureUri
    );
    this.setState({ visible: false });
  };

  navigateToCamera = () => {
    this.setState({ addNewMenuVisible: false });
    this.props.navigation.navigate('Camera', {
      visitId: this.state.visitId
    });
  };

  savePictures = () => {
    this.props.navigation.navigate('Home');
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
      const picId = uuidv4();
      FileSystem.moveAsync({
        from: result.uri,
        to: `${FileSystem.documentDirectory}photos/Photo_${picId}.jpg`
      });
      if (result && result.uri) {
        this.props.addPicture(
          this.props.visitData,
          this.props.route.params?.visitId,
          `photos/Photo_${picId}.jpg`,
          '',
          '',
          '',
          undefined,
          -100,
          -100,
          20,
          null
        );
      }
    }
  };

  render() {
    const { visitPictures } = this.props.visitData[
      this.props.route.params?.visitId
    ];
    const { visitData } = this.props;
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
          centerComponent={{ text: this.props.route.params?.visitName, style: styles.headerCenter }}
          rightComponent={(
            <IconButton
              icon="square-edit-outline"
              style={styles.rightHeaderComponent}
              color="white"
              size={30}
              onPress={() => this.props.navigation.navigate('EditEvent', {
                ...visitData[this.props.route.params?.visitId]
              })}
            />
          )}
        />
        <View style={styles.innerSpacer}>
          <Input
            label="Visit Date"
            labelStyle={styles.labelFont}
            color="#0A2B66"
            inputStyle={styles.inputFont}
            editable={false}
            value={Moment(this.props.route.params?.visitDate).format(
              'MMMM D, YYYY'
            )}
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
        </View>
        <View style={styles.innerSpacer}>
          <Input
            label="Visit Information"
            labelStyle={styles.labelFont}
            inputStyle={styles.inputFont}
            color="#0A2B66"
            editable={false}
            multiline
            value={this.props.route.params?.visitNotes}
            style={styles.inputTimePicker}
            leftIcon={(
              <MaterialCommunityIcons
                name="pen"
                size={24}
                style={styles.inputIcon}
                color="#0A2B66"
              />
                      )}
          />
        </View>
        <Provider>
          <ScrollView>
            {(!visitPictures
                || (visitPictures && visitPictures.length === 0)) && (
                  <View style={styles.inputSpacer}>
                    <View style={styles.notificationView}>
                      <Text style={styles.notificationText}>
                        Add Pictures to your Visit
                      </Text>
                    </View>
                  </View>
            )}
            <View style={styles.scrollView}>
              {visitPictures
                && visitPictures.length > 0
                && visitPictures.map((picture, i) => (
                  <TouchableOpacity
                    key={`picture-${i}`}
                    style={styles.pictureButton}
                    onPress={() => this.props.navigation.navigate('ViewPhoto', {
                      visitId: this.state.visitId,
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
                        visitId: this.props.route.params?.visitId,
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
                        source={{ uri: `${FileSystem.documentDirectory}${picture.uri}` }}
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
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  visitData: state.visits.visits.visitData,
  visits: state.visits
});

const mapDispatchToProps = (dispatch) => ({
  deletePicture: (visitData, visitId, pictureUri) => {
    dispatch(deletePicture(visitData, visitId, pictureUri));
  },
  addPicture: (
    visitData,
    visitId,
    pictureUri,
    pictureNote,
    pictureLocation,
    pictureBodyPart,
    pictureId,
    locationX,
    locationY,
    diameter,
    faceDetectedValues
  ) => {
    dispatch(
      addPicture(
        visitData,
        visitId,
        pictureUri,
        pictureNote,
        pictureLocation,
        pictureBodyPart,
        pictureId,
        locationX,
        locationY,
        diameter,
        faceDetectedValues
      )
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitScreen);
