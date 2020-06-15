import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  Slider,
  Image as RNImage
} from 'react-native';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-material-dropdown';
import { Header } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import Svg, { Circle, Image } from 'react-native-svg';
import { THREE } from 'expo-three';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from 'expo-image-manipulator';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Provider
} from 'react-native-paper';
import { connect } from 'react-redux';
import ImageZoom from 'react-native-image-pan-zoom';
import { addPicture, deletePicture } from '../../redux/actions';
import styles from './styles';
import noteDropdownInfo from '../../assets/notes.json';

THREE.suppressExpoWarnings(true);

const IMAGE_CROP_HEIGHT = Platform.OS === 'ios' ? 168 : 220;

class CameraScreen extends React.Component {
  camera = null;

  _baseScale = new Animated.Value(1);

  _pinchScale = new Animated.Value(1);

  _scale = Animated.multiply(this._baseScale, this._pinchScale);

  _lastScale = 1;

  _lastCameraValue = 0;

  constructor(props) {
    super(props);
    const pictureId = this.props.route.params?.pictureId;
    const overlayPictureId = this.props.route.params?.overlayPictureId;

    let photo;
    let pictureLocation;
    let pictureNote;
    let pictureBodyPart;
    let locationX = -100;
    let locationY = -100;
    let diameter = 20;
    let visit = [];
    if (this.props.route.params?.visitId !== '') {
      visit = this.props.visitData[
        this.props.route.params?.visitId
      ];
    }
    if (pictureId && visit.length > 0) {
      const existingPicture = visit.visitPictures.find(
        (data) => data.pictureId === pictureId
      );

      if (existingPicture) {
        photo = existingPicture.uri;
        pictureLocation = existingPicture.pictureLocation;
        pictureBodyPart = existingPicture.pictureBodyPart;
        pictureNote = existingPicture.pictureNote;
        locationX = existingPicture.locationX || -100;
        locationY = existingPicture.locationY || -100;
        diameter = existingPicture.diameter || 20;
      }
    }
    this.state = {
      hasCameraPermission: null,
      drawEnabled: false,
      type: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
      showNoteDialog: false,
      photo,
      pictureId,
      pictureLocation,
      pictureBodyPart,
      pictureNote,
      locationX,
      locationY,
      diameter,
      opacity: 4,
      cameraZoomValue: 0,
      overlayPictureId
    };
    this._onPinchGestureEvent = () => Animated.event([{ nativeEvent: { scale: this._pinchScale } }], {
      useNativeDriver: true
    });
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  savePictureToVisit = async () => {
    const {
      photo,
      pictureNote,
      pictureLocation,
      pictureBodyPart,
      pictureId,
      locationX,
      locationY,
      diameter
    } = this.state;
    if (this.props.route.params?.visitId !== '') {
      this.props.addPicture(
        this.props.visitData,
        this.props.route.params?.visitId,
        photo,
        pictureNote,
        pictureLocation,
        pictureBodyPart,
        pictureId,
        locationX,
        locationY,
        diameter
      );
      this.props.navigation.navigate('VisitDescription');
    } else {
      const pictureArray = [];
      const picId = this.props.route.params?.pictureId || uuidv4();
      pictureArray.push({
        pictureId: picId,
        uri: photo,
        pictureNote,
        pictureLocation,
        pictureBodyPart,
        locationX,
        locationY,
        diameter,
        dateCreated: Moment().format('MM/DD/YYYY hh:mm A')
      });
      this.props.navigation.navigate('AddEvent', { pictureArray, picId });
    }
  };

  // implement face detection callback function
  onFacesDetected({ faces }) {
    // print the found face data to console
    console.log(faces);
    // store faces to component state
  }

  // implement face detection error function
  onFaceDetectionError(error) {
    console.log(error);
  }

  handleCapture = async () => {
    if (this.state.photoRetry) {
      await this.props.deletePicture(
        undefined,
        undefined,
        this.state.photoRetry
      );
      await this.setState({ photo: undefined });
    }

    this.camera
      .takePictureAsync({
        exif: true
      })
      .then(async (data) => {
        const photo = await ImageManipulator.manipulateAsync(data.uri, [
          {
            rotate: 0
          }
        ]);
        this.setState({
          photo: photo.uri
        });
      });
  };

  retryPicture = () => {
    this.setState((prevState) => ({
      photoRetry: prevState.photo,
      photo: undefined,
      locationX: -100,
      locationY: -100,
      diameter: 20
    }));
  };

  enableDrawing = async () => {
    if (this.state.drawEnabled === true) {
      this.setState({ drawEnabled: false });
    } else {
      this.setState({ drawEnabled: true });
    }
  };

  _hideDialog = () => {
    this.setState({ showNoteDialog: false });
  };

  _showDialog = () => this.setState({ showNoteDialog: true });

  setLocation = (event) => {
    if (this.state.drawEnabled) {
      const { locationX, locationY } = event.nativeEvent;
      this.setState({ locationX, locationY });
    }
  };

  _onPinchHandlerStateChange = (event) => {
    if (this.state.drawEnabled) {
      this._lastScale *= event.nativeEvent.scale;
      this.setState({ diameter: 20 * this._lastScale });
    } else {
      let oldValue = this._lastCameraValue;
      this._lastCameraValue = event.nativeEvent.scale;
      if (oldValue < this._lastCameraValue) {
        const newValue = this.state.cameraZoomValue + 0.01;
        if (newValue > 1) {
          this.setState({ cameraZoomValue: 1 });
        } else {
          this.setState({ cameraZoomValue: newValue });
        }
      } else {
        const newValue = this.state.cameraZoomValue - 0.01;
        if (newValue < 0) {
          this.setState({ cameraZoomValue: 0 });
        } else {
          this.setState({ cameraZoomValue: newValue });
        }
      }
    }
  };

  onStartShouldSetResponder = () => true;

  goBack = async () => {
    if (this.state.photoRetry) {
      await this.props.deletePicture(
        this.props.visitData,
        this.props.route.params?.visitId,
        this.state.photoRetry
      );
    }
    this.props.navigation.goBack();
  };

  onOpacityChange = (v) => {
    this.setState({ opacity: v });
  };

  onZoomChange = (zoomValue) => {
    this.setState({ cameraZoomValue: zoomValue });
  };

  renderSvg() {
    return (
      <Svg height="100%" width="100%" style={{ backgroundColor: '#33AAFF' }}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={this.state.photo}
        />
        <Circle
          cx={this.state.locationX}
          cy={this.state.locationY}
          r={this.state.diameter}
          strokeWidth="2"
          stroke="red"
          fill="none"
        />
      </Svg>
    );
  }

  renderOverlaySvg(pictureId) {
    const visitId = this.props.route.params?.visitId;
    // const pictureId = this.props.route.params?.pictureId;
    let currentPicture = [];
    if (visitId === '') {
      currentPicture = this.props.route.params?.visitPictures.find(
        (data) => data.pictureId === pictureId
      );
    } else {
      currentPicture = this.props.visitData[visitId].visitPictures.find(
        (data) => data.pictureId === pictureId
      );
    }
    if (!currentPicture) {
      return <Svg />;
    }

    let cy = -100;
    if (currentPicture.locationY) {
      cy = currentPicture.locationY;
    }
    return (
      <Svg
        height="100%"
        width="100%"
        style={{
          backgroundColor: 'transparent'
        }}
      >
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          opacity={this.state.opacity / 10.0}
          preserveAspectRatio="xMidYMid slice"
          href={currentPicture.uri || ''}
        />
        <Circle
          opacity={this.state.opacity / 10.0}
          cx={currentPicture.locationX || -100}
          cy={cy}
          r={currentPicture.diameter || 20}
          strokeWidth="4"
          stroke="red"
          fill="none"
        />
      </Svg>
    );
  }

  render() {
    const {
      hasCameraPermission,
      photo,
      type,
      flashMode,
      drawEnabled
    } = this.state;

    const drawIconColor = drawEnabled ? '#0680CD' : 'white';

    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    let visitPictures = [];

    if (this.props.route.params?.visitId !== '') {
      visitPictures = this.props.visitData[
        this.props.route.params?.visitId].visitPictures;
    } else {
      visitPictures = this.props.route.params?.visitPictures;
    }

    let visitPhoto = null;
    if (visitPictures && this.state.overlayPictureId) {
      visitPhoto = visitPictures.find(
        (p) => p.pictureId === this.state.overlayPictureId
      );
    }
    return (
      <Provider>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Portal>
            <Dialog
              visible={this.state.showNoteDialog}
              onDismiss={this._hideDialog}
              style={{ top: -100 }}
            >
              <Dialog.ScrollArea>
                <KeyboardAwareScrollView>
                  <Dialog.Content>
                    <Dropdown
                      label="Location"
                      data={noteDropdownInfo.location}
                      value={this.state.pictureLocation}
                      onChangeText={(value) => {
                        this.setState({ pictureLocation: value });
                      }}
                    />
                    <Dropdown
                      label="Body Part"
                      data={noteDropdownInfo.bodyParts}
                      value={this.state.pictureBodyPart}
                      onChangeText={(value) => {
                        this.setState({ pictureBodyPart: value });
                      }}
                    />
                    <TextField
                      label="Notes"
                      onChangeText={(text) => {
                        this.setState({ pictureNote: text });
                      }}
                      value={this.state.pictureNote}
                    />
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={this._hideDialog}>Done</Button>
                  </Dialog.Actions>
                </KeyboardAwareScrollView>
              </Dialog.ScrollArea>
            </Dialog>
          </Portal>
          {!photo && (
            <Header
              containerStyle={styles.containerNoPhoto}
              leftComponent={(
                <IconButton
                  icon="chevron-left"
                  style={styles.leftHeaderComponent}
                  color="white"
                  size={40}
                  onPress={() => this.props.navigation.goBack()}
                />
              )}
              centerComponent={{
                text: 'Visits',
                style: { fontSize: 20, color: '#fff' }
              }}
            />
          )}
          {photo && (
            <Header
              containerStyle={{
                backgroundColor: '#000',
                justifyContent: 'space-around'
              }}
              leftComponent={{
                text: 'Cancel',
                style: { fontSize: 20, color: '#0680CD' },
                onPress: () => this.goBack()
              }}
              rightComponent={{
                text: 'Save',
                style: { fontSize: 20, color: '#0680CD' },
                onPress: () => this.savePictureToVisit()
              }}
            />
          )}
          {!photo && (
          <PinchGestureHandler
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this._onPinchHandlerStateChange}
          >
            <View style={{ flex: 1 }}>
              <Camera
                style={{ flex: 1 }}
                type={this.state.type}
                flashMode={this.state.flashMode}
                ref={(camera) => (this.camera = camera)}
                zoom={this.state.cameraZoomValue}
                faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.fast,
                  detectLandmarks: FaceDetector.Constants.Landmarks.all,
                  runClassifications: FaceDetector.Constants.Classifications.all,
                  minDetectionInterval: 100,
                  tracking: true,
                }}
                onFacesDetected={this.onFacesDetected}
                onFacesDetectionError={this.onFacesDetectionError}
              >
                {visitPhoto && (
                <View
                  style={style.overlayPhoto}
                  key={`picture-${visitPhoto.uri}`}
                >
                  <View style={style.sliderContainer}>
                    <Slider
                      style={style.slider}
                      minimumValue={0}
                      maximumValue={10}
                      step={0.5}
                      value={this.state.opacity}
                      onValueChange={this.onOpacityChange}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#000000"
                    />
                  </View>
                  <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={
                        Dimensions.get('screen').height - IMAGE_CROP_HEIGHT
                      }
                    imageWidth={Dimensions.get('window').width}
                    imageHeight={
                        Dimensions.get('screen').height - IMAGE_CROP_HEIGHT
                      }
                  >
                    {this.renderOverlaySvg(visitPhoto.pictureId)}
                  </ImageZoom>
                </View>
                )}
              </Camera>
              <View
                style={{
                  flex: 0,
                  backgroundColor: '#000',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  display: 'flex',
                  alignItems: 'center',
                  paddingBottom: 10
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 20,
                    paddingLeft: 20
                  }}
                  onPress={() => {
                    const newFlashMode = flashMode === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off;
                    this.setState({ flashMode: newFlashMode });
                  }}
                >
                  <MaterialCommunityIcons
                    size={30}
                    name={
                      this.state.flashMode === Camera.Constants.FlashMode.off
                        ? 'flash-off'
                        : 'flash'
                    }
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 20
                  }}
                  onPress={() => this.handleCapture()}
                >
                  <MaterialCommunityIcons
                    size={70}
                    name="checkbox-blank-circle-outline"
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 20,
                    paddingRight: 20
                  }}
                  onPress={() => {
                    const newType = type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back;
                    this.setState({ type: newType });
                  }}
                >
                  <MaterialCommunityIcons
                    size={30}
                    name="camera-party-mode"
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </PinchGestureHandler>
          )}
          {photo && (
            <PinchGestureHandler
              onGestureEvent={this._onPinchGestureEvent}
              onHandlerStateChange={this._onPinchHandlerStateChange}
            >
              <View style={{ display: 'flex', flex: 1 }}>
                <View
                  style={{ flex: 1 }}
                  onStartShouldSetResponder={this.onStartShouldSetResponder}
                  onResponderRelease={this.setLocation}
                >
                  {this.renderSvg()}
                </View>
                <View
                  style={{
                    flex: 0,
                    backgroundColor: '#000',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: 'flex-end',
                      alignItems: 'center'
                    }}
                    onPress={this.retryPicture}
                  >
                    <MaterialCommunityIcons
                      size={35}
                      name="autorenew"
                      color="white"
                      style={{ padding: 10 }}
                    />
                    <Text
                      color="#FFF"
                      style={{ color: '#fff', paddingBottom: 30, fontSize: 16 }}
                    >
                      Retry
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: 'flex-end',
                      alignItems: 'center'
                    }}
                    onPress={() => this.enableDrawing()}
                  >
                    <MaterialCommunityIcons
                      size={35}
                      name="gesture"
                      style={{ padding: 10 }}
                      color={drawIconColor}
                    />
                    <Text
                      style={{
                        color: drawIconColor,
                        paddingBottom: 30,
                        fontSize: 16
                      }}
                    >
                      Mark
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: 'flex-end',
                      alignItems: 'center'
                    }}
                    onPress={this._showDialog}
                  >
                    <MaterialCommunityIcons
                      size={35}
                      name="note-plus"
                      style={{ padding: 10 }}
                      color="white"
                    />
                    <Text
                      color="#FFF"
                      style={{ color: '#fff', paddingBottom: 30, fontSize: 16 }}
                    >
                      Add Notes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </PinchGestureHandler>
          )}
        </View>
      </Provider>
    );
  }
}

const style = StyleSheet.create({
  overlayPhoto: {
    position: 'absolute',
    top: 0,
    flex: 1
  },
  sliderContainer: {
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    zIndex: 100,
    right: -135,
    top: 200
  },
  zoomSliderContainer: {
    transform: [{ rotate: '360deg' }],
    position: 'absolute',
    zIndex: 100,
    right: 25,
    bottom: 100
  },
  slider: {
    width: 300,
    height: 40,
    flex: 1,
    margin: 20
  }
});
const mapStateToProps = (state) => ({
  visitData: state.visits.visits.visitData,
  visits: state.visits
});

const mapDispatchToProps = (dispatch) => ({
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
    diameter
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
        diameter
      )
    );
  },
  deletePicture: (visitData, visitId, pictureUri) => {
    dispatch(deletePicture(visitData, visitId, pictureUri));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
