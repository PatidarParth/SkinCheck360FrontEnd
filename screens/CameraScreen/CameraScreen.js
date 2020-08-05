/* eslint-disable react/sort-comp */
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
  YellowBox,
  Image as RNImage
} from 'react-native';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown';
import { Header } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import Svg, { Circle, Image } from 'react-native-svg';
import { THREE } from 'expo-three';
import * as Permissions from 'expo-permissions';
import { API, graphqlOperation, Storage } from 'aws-amplify';
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
import ImageZoom from 'react-native-image-pan-zoom';
import { deletePicture } from '../../graphQL/queries';
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
    let photo;
    const pictureLocation = '';
    const faceDetectedArray = [];
    const pictureNote = '';
    const pictureBodyPart = '';
    const locationX = -100;
    const locationY = -100;
    const diameter = 20;
    this.state = {
      hasCameraPermission: null,
      drawEnabled: false,
      type: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
      showNoteDialog: false,
      photo,
      pictureLocation,
      pictureBodyPart,
      pictureNote,
      locationX,
      locationY,
      diameter,
      opacity: 4,
      faceDetectedArray,
      cameraZoomValue: 0,
      matchingOverlay: 'Overlay does not match',
      overlayMatchColor: 'white'
    };
    this._onPinchGestureEvent = () => Animated.event([{ nativeEvent: { scale: this._pinchScale } }], {
      useNativeDriver: true
    });

    YellowBox.ignoreWarnings([
      'Deprecation warning',
      'VirtualizedList',
      'Accessing view manager',
      'Warning:',
      'Possible',
      'Non-serializable values were found in the navigation state',
    ]);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleCapture = async () => {
    // const { height, width } = Dimensions.get('window');
    // const maskRowHeight = Math.round((height - 200) / 40);
    // const maskColWidth = (width - 200) / 2;
    this.camera
      .takePictureAsync({
        exif: true
      })
      .then(async (data) => {
        // const { width } = data;
        // const { height } = data;
        if (this.state.type === Camera.Constants.Type.back) {
          const photo = await ImageManipulator.manipulateAsync(data.uri, [
            { rotate: 0 },
            { resize: { width: 600 } }
            // {
            //   crop: {
            //     originX: 0,
            //     originY: (height - width) / 2,
            //     width,
            //     height: width
            //   }
            // }
          ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true });
          this.setState({
            photo: photo.uri
          });
        } else if (this.state.type === Camera.Constants.Type.front) {
          const photo = await ImageManipulator.manipulateAsync(data.uri, [
            { rotate: 0 },
            { flip: ImageManipulator.FlipType.Horizontal },
            { resize: { width: 600 } }
            // {
            //   crop: {
            //     originX: 0,
            //     originY: (height - width) / 2,
            //     width,
            //     height: width
            //   }
            // }
          ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true });
          this.setState({
            photo: photo.uri
          });
        }
      });
  };

  // eslint-disable-next-line react/sort-comp
  savePictureToVisit = async () => {
    const {
      photo,
      pictureNote,
      pictureLocation,
      pictureBodyPart,
      locationX,
      locationY,
      diameter,
      faceDetectedArray
    } = this.state;
    if (this.props.route.params?.pictureId && this.props.route.params?.visitId) {
      await API.graphql(graphqlOperation(deletePicture, { pictureId: this.props.route.params?.pictureId }));
      // delete from s3
      await Storage.remove(`uploads/${this.props.route.params?.visitId}/${this.props.route.params?.pictureId}`);
    }
    const pictureArray = [];
    const picId = this.props.route.params?.pictureId || uuidv4();
    const faceDetectedValues = faceDetectedArray[0] !== undefined ? faceDetectedArray[0] : '[]';
    pictureArray.push({
      temporary: 'temporary',
      id: picId,
      uri: photo,
      note: pictureNote,
      location: pictureLocation,
      bodyPart: pictureBodyPart,
      locationX,
      locationY,
      diameter,
      dateCreated: Moment().format('MM/DD/YYYY hh:mm A'),
      faceDetectedValues
    });
    if (this.props.route.params?.visitId !== '') {
      this.props.navigation.navigate('VisitDescription', { pictureArray, picId });
    } else {
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

  retryPicture = () => {
    this.setState(() => ({
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
  };

  onStartShouldSetResponder = () => true;

  onOpacityChange = (v) => {
    this.setState({ opacity: v });
  };

  onZoomChange = (zoomValue) => {
    this.setState({ cameraZoomValue: zoomValue });
  };

  componentDidUpdate = () => {
    // if (this.props.route.params?.overlayPicture.faceDetectedValues !== undefined) {
    //   const overlayFaceArray = this.props.route.params?.overlayPicture.faceDetectedValues;
    //   console.log(overlayFaceArray);
    //   if (overlayFaceArray.length > 0 && overlayFaceArray !== '[]') {
    //     this.matchOverlayToCamera(overlayFaceArray);
    //   }
    // }
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
          href={`${this.state.photo}`}
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

  renderOverlaySvg(overlayPicture) {
    let cy = -100;
    if (overlayPicture.locationY) {
      cy = overlayPicture.locationY;
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
          href={`${overlayPicture.uri}` || ''}
        />
        <Circle
          opacity={this.state.opacity / 10.0}
          cx={overlayPicture.locationX || -100}
          cy={cy}
          r={overlayPicture.diameter || 20}
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
    } = this.state;

    const drawIconColor = drawEnabled ? '#0680CD' : 'white';

    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }


    const overlayPicture = this.props.route.params?.overlayPicture;
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
                onPress: () => this.props.navigation.goBack()
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
                {!overlayPicture && (
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
                {overlayPicture && (
                <View
                  style={style.overlayPhoto}
                  key={`picture-${overlayPicture.uri}`}
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
                    {this.renderOverlaySvg(overlayPicture)}
                  </ImageZoom>
                </View>
                )}
                {overlayPicture && (
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

export default CameraScreen;
