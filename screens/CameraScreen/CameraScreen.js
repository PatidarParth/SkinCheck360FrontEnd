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
import * as FileSystem from 'expo-file-system';
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

const IMAGE_CROP_HEIGHT = Platform.OS === 'ios' ? 140 : 220;

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
    const faceDetectedArray = [];
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
      faceDetectedArray,
      cameraZoomValue: 0,
      overlayPictureId,
      matchingOverlay: 'Overlay does not match',
      overlayMatchColor: 'white'
    };
    this._onPinchGestureEvent = () => Animated.event([{ nativeEvent: { scale: this._pinchScale } }], {
      useNativeDriver: true
    });
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`).catch(() => {
    });
  }

  // eslint-disable-next-line react/sort-comp
  savePictureToVisit = async () => {
    const {
      photo,
      pictureNote,
      pictureLocation,
      pictureBodyPart,
      pictureId,
      locationX,
      locationY,
      diameter,
      faceDetectedArray
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
        diameter,
        faceDetectedArray[0] !== undefined ? faceDetectedArray[0] : null
      );
      this.props.navigation.navigate('VisitDescription');
    } else {
      const pictureArray = [];
      const picId = this.props.route.params?.pictureId || uuidv4();
      const faceDetectedValues = faceDetectedArray[0] !== undefined ? faceDetectedArray[0] : null;
      pictureArray.push({
        pictureId: picId,
        uri: photo,
        pictureNote,
        pictureLocation,
        pictureBodyPart,
        locationX,
        locationY,
        diameter,
        dateCreated: Moment().format('MM/DD/YYYY hh:mm A'),
        faceDetectedValues
      });
      this.props.navigation.navigate('AddEvent', { pictureArray, picId });
    }
  };

  // implement face detection callback function
  onFacesDetected = ({ faces }) => {
    this.setState({ faceDetectedArray: faces });
  }

  // implement face detection error function
  // eslint-disable-next-line class-methods-use-this
  onFaceDetectionError(error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }


  matchOverlayToCamera = (overlayFaceArray) => {
    // overlay left ear
    const overlayLeftEarXPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.leftEarPosition.x : null) + 20;
    const overlayLeftEarXPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.leftEarPosition.x : null) - 20;
    const overlayLeftEarYPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.leftEarPosition.y : null) + 20;
    const overlayLeftEarYPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.leftEarPosition.y : null) - 20;
    // overlay right ear
    const overlayRightEarXPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.rightEarPosition.x : null) + 20;
    const overlayRightEarXPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.rightEarPosition.x : null) - 20;
    const overlayRightEarYPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.rightEarPosition.y : null) + 20;
    const overlayRightEarYPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.rightEarPosition.y : null) - 20;
    // overlay nose
    const overlayNoseXPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.noseBasePosition.x : null) + 20;
    const overlayNoseXPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.noseBasePosition.x : null) - 20;
    const overlayNoseYPositionCeiling = Math.ceil(overlayFaceArray !== null ? overlayFaceArray.noseBasePosition.y : null) + 20;
    const overlayLNoseYPositionFloor = Math.floor(overlayFaceArray !== null ? overlayFaceArray.noseBasePosition.y : null) - 20;
    // camera left ear
    const cameraLeftEarXPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].leftEarPosition.x : null;
    const cameraLeftEarYPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].leftEarPosition.y : null;
    // camera right ear
    const cameraRightEarXPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].rightEarPosition.x : null;
    const cameraRightEarYPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].rightEarPosition.y : null;
    // camera Nose
    const cameraNoseXPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].noseBasePosition.x : null;
    const cameraNoseYPosition = this.state.faceDetectedArray[0] !== undefined ? this.state.faceDetectedArray[0].noseBasePosition.y : null;

    if (overlayLeftEarXPositionCeiling !== null) {
      if (((cameraLeftEarXPosition >= overlayLeftEarXPositionFloor && cameraLeftEarXPosition <= overlayLeftEarXPositionCeiling)
      && (cameraLeftEarYPosition >= overlayLeftEarYPositionFloor && cameraLeftEarYPosition <= overlayLeftEarYPositionCeiling))
      && ((cameraRightEarXPosition >= overlayRightEarXPositionFloor && cameraRightEarXPosition <= overlayRightEarXPositionCeiling)
      && (cameraRightEarYPosition >= overlayRightEarYPositionFloor && cameraRightEarYPosition <= overlayRightEarYPositionCeiling))
      && ((cameraNoseXPosition >= overlayNoseXPositionFloor && cameraNoseXPosition <= overlayNoseXPositionCeiling)
      && (cameraNoseYPosition >= overlayLNoseYPositionFloor && cameraNoseYPosition <= overlayNoseYPositionCeiling))) {
        if (cameraLeftEarXPosition !== null || cameraLeftEarYPosition !== null || cameraRightEarXPosition !== null || cameraRightEarYPosition !== null
          || cameraNoseXPosition !== null || cameraNoseYPosition !== null) {
          if (this.state.matchingOverlay !== 'Hold Still, Overlay Matches') {
            this.setState({ matchingOverlay: 'Hold Still, Overlay Matches' });
            this.setState({ overlayMatchColor: '#3CB371' });
          }
        }
      } else if (this.state.matchingOverlay !== 'Overlay does not match') {
        this.setState({ matchingOverlay: 'Overlay does not match' });
        this.setState({ overlayMatchColor: 'white' });
      }
    }
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
    const { height, width } = Dimensions.get('window');
    console.log(height, width);
    const maskRowHeight = Math.round((height - 200) / 40);
    const maskColWidth = (width - 200) / 2;
    this.camera
      .takePictureAsync({
        exif: true
      })
      .then(async (data) => {
        const { width } = data;
        const { height } = data;
        console.log(height, width, maskColWidth, maskRowHeight);
        if (this.state.type === Camera.Constants.Type.back) {
          const photo = await ImageManipulator.manipulateAsync(data.uri, [
            { rotate: 0 },
            // {  resize: { width: maskColWidth } }
            {
              crop: {
                originX: 0,
                originY: (height - width) / 2,
                width,
                height: width
              }
            }

          ]);
          const picId = this.props.route.params?.pictureId || uuidv4();
          FileSystem.moveAsync({
            from: photo.uri,
            to: `${FileSystem.documentDirectory}photos/Photo_${picId}.jpg`
          });
          this.setState({
            photo: `photos/Photo_${picId}.jpg`
          });
        } else if (this.state.type === Camera.Constants.Type.front) {
          const picId = this.props.route.params?.pictureId || uuidv4();
          const photo = await ImageManipulator.manipulateAsync(data.uri, [
            { rotate: 0 },
            { flip: ImageManipulator.FlipType.Horizontal },
            {
              crop: {
                originX: 0,
                originY: (height - width) / 2,
                width,
                height: width
              }
            }
          ]);
          FileSystem.moveAsync({
            from: photo.uri,
            to: `${FileSystem.documentDirectory}photos/Photo_${picId}.jpg`
          });
          this.setState({
            photo: `photos/Photo_${picId}.jpg`
          });
        }
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
    }
    // } else {
    //   const oldValue = this._lastCameraValue;
    //   this._lastCameraValue = event.nativeEvent.scale;
    //   if (oldValue < this._lastCameraValue) {
    //     const newValue = this.state.cameraZoomValue + 0.01;
    //     if (newValue > 1) {
    //       this.setState({ cameraZoomValue: 1 });
    //     } else {
    //       this.setState({ cameraZoomValue: newValue });
    //     }
    //   } else {
    //     const newValue = this.state.cameraZoomValue - 0.01;
    //     if (newValue < 0) {
    //       this.setState({ cameraZoomValue: 0 });
    //     } else {
    //       this.setState({ cameraZoomValue: newValue });
    //     }
    //   }
    // }
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

  componentDidUpdate = () => {
    const pictureId = this.props.route.params?.overlayPictureId;
    const visitId = this.props.route.params?.visitId;

    let currentPicture = [];
    let overlayFaceArray = [];
    if (pictureId !== undefined) {
      if (visitId === '') {
        currentPicture = this.props.route.params?.visitPictures.find(
          (data) => data.pictureId === pictureId
        );
      } else {
        currentPicture = this.props.visitData[visitId].visitPictures.find(
          (data) => data.pictureId === pictureId
        );
      }
      overlayFaceArray = currentPicture.faceDetectedValues;
      this.matchOverlayToCamera(overlayFaceArray);
    }
  }

  renderSvg() {
    return (
      <Svg height="100%" width="100%" style={{ backgroundColor: 'transparent' }}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={`${FileSystem.documentDirectory}${this.state.photo}`}
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
          href={`${FileSystem.documentDirectory}${currentPicture.uri}` || ''}
        />
        <Circle
          opacity={this.state.opacity / 10.0}
          cx={currentPicture.locationX || -100}
          cy={cy}
          r={currentPicture.diameter || 20}
          strokeWidth="2"
          stroke="red"
          fill="none"
        />
      </Svg>
    );
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const maskRowHeight = Math.round((height - 200) / 40);
    const maskColWidth = (width - 200) / 2;
    const {
      hasCameraPermission,
      photo,
      type,
      flashMode,
      drawEnabled,
      matchingOverlay
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
                <Dialog.Content>
                  <Dropdown
                    label="Location"
                    style={{ fontFamily: 'Avenir-Light' }}
                    data={noteDropdownInfo.location}
                    itemTextStyle={{ fontFamily: 'Avenir-Light' }}
                    value={this.state.pictureLocation}
                    onChangeText={(value) => {
                      this.setState({ pictureLocation: value });
                    }}
                  />
                  <Dropdown
                    label="Body Part"
                    itemTextStyle={{ fontFamily: 'Avenir-Light' }}
                    data={noteDropdownInfo.bodyParts}
                    style={{ fontFamily: 'Avenir-Light' }}
                    value={this.state.pictureBodyPart}
                    onChangeText={(value) => {
                      this.setState({ pictureBodyPart: value });
                    }}
                  />
                  <TextField
                    label="Notes"
                    style={{ fontFamily: 'Avenir-Light' }}
                    onChangeText={(text) => {
                      this.setState({ pictureNote: text });
                    }}
                    value={this.state.pictureNote}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={this._hideDialog}>Done</Button>
                </Dialog.Actions>
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
            ce
            nterComponent={{ text: '', style: styles.headerCenter }}
          />
          )}
          {photo && (
            <Header
              containerStyle={{
                backgroundColor: '#0A2B66',
                justifyContent: 'space-around'
              }}
              leftComponent={{
                text: 'Cancel',
                style: { fontSize: 20, color: 'white', fontFamily: 'Avenir-Light' },
                onPress: () => this.goBack()
              }}
              rightComponent={{
                text: 'Save',
                style: { fontSize: 20, color: 'white', fontFamily: 'Avenir-Light' },
                onPress: () => this.savePictureToVisit()
              }}
            />
          )}
          {!photo && (
            <View style={{ flex: 1 }}>
              <Camera
                style={{ flex: 1 }}
                type={this.state.type}
                flashMode={this.state.flashMode}
                ref={(camera) => (this.camera = camera)}
                zoom={this.state.cameraZoomValue}
                autoFocus={Camera.Constants.AutoFocus.on}
                whiteBalance={Camera.Constants.WhiteBalance.auto}
                faceDetectorSettings={{
                  mode: FaceDetector.Constants.Mode.accurate,
                  detectLandmarks: FaceDetector.Constants.Landmarks.all,
                  runClassifications: FaceDetector.Constants.Classifications.all,
                  minDetectionInterval: 500,
                  tracking: true,
                }}
                onFacesDetected={this.onFacesDetected}
                onFacesDetectionError={this.onFacesDetectionError}
              >
                {!visitPhoto && (
                <View style={styles.maskOutter}>
                  <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                  <View style={[{ flex: 40 }, styles.maskCenter]}>
                    <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                    <View style={styles.maskInner}>

                      {/* top */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: 10,
                          borderColor: '#FFFFFF',
                          borderTopWidth: 0.5
                        }}
                      />
                      {/* #bottom */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 10,
                          borderColor: '#FFFFFF',
                          borderBottomWidth: 0.5
                        }}
                      />
                      {/* left */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 20,
                          height: '100%',
                          borderColor: '#FFFFFF',
                          borderLeftWidth: 0.5
                        }}
                      />
                      {/* right */}
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 20,
                          height: '100%',
                          borderColor: '#FFFFFF',
                          borderRightWidth: 1
                        }}
                      />
                    </View>
                    <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                  </View>
                  <View
                    style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
                  />
                </View>
                )}
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
                      step={0.00001}
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
                {visitPhoto && (
                <View
                  style={{
                    backgroundColor: 'black',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                  }}
                >
                  <Text style={{
                    fontFamily: 'Avenir-Light',
                    fontSize: 22,
                    color: this.state.overlayMatchColor,
                  }}
                  >
                    {this.state.matchingOverlay}
                  </Text>
                </View>
                )}
                {photo && (
                <View
                  style={{
                    backgroundColor: 'black',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                  }}
                >
                  <Text style={{
                    fontFamily: 'Avenir-Light',
                    fontSize: 22,
                    color: this.state.overlayMatchColor,
                  }}
                  >
                    {this.state.matchingOverlay}
                  </Text>
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
                    paddingLeft: 30
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
                    paddingTop: 5
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
                    paddingRight: 30
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
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                    }}
                    onPress={this.retryPicture}
                  >
                    <MaterialCommunityIcons
                      size={35}
                      name="autorenew"
                      color="white"
                      style={{ paddingTop: 10 }}
                    />
                    <Text
                      color="#FFF"
                      style={{
                        color: '#fff', paddingBottom: 10, fontSize: 16, fontFamily: 'Avenir-Light'
                      }}
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
                      style={{ paddingTop: 10 }}
                      color={drawIconColor}
                    />
                    <Text
                      style={{
                        color: drawIconColor,
                        paddingBottom: 10,
                        fontSize: 16,
                        fontFamily: 'Avenir-Light'
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
                      style={{ paddingTop: 10 }}
                      color="white"
                    />
                    <Text
                      color="#FFF"
                      style={{
                        color: '#fff', paddingBottom: 10, fontSize: 16, fontFamily: 'Avenir-Light'
                      }}
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
  slider: {
    width: 300,
    height: 100,
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
  },
  deletePicture: (visitData, visitId, pictureUri) => {
    dispatch(deletePicture(visitData, visitId, pictureUri));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
