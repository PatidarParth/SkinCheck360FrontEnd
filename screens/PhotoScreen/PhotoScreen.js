// Aboutscreen.js
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions, Platform
} from 'react-native';
import {
  Button,
  Colors,
  Dialog,
  IconButton,
  Portal,
  Provider
} from 'react-native-paper';
import Svg, { Circle, Image } from 'react-native-svg';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ImageZoom from 'react-native-image-pan-zoom';
// import Spinner from 'react-native-loading-spinner-overlay';
import styles from './styles';

const IMAGE_CROP_HEIGHT = Platform.OS === 'ios' ? 141 : 220;

class PhotoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoteDialog: false
      // loading: false
    };
  }

  _hideDialog = () => {
    this.setState({ showNoteDialog: false });
  };

  _showDialog = () => this.setState({ showNoteDialog: true });

  overlayPicture = (typeOfOverlay) => {
    const currentPicture = this.props.route.params?.currentPicture;
    this.props.navigation.navigate('Camera', {
      overlayType: typeOfOverlay,
      visitId: this.props.route.params?.visitId,
      overlayPicture: currentPicture,
      visitPictures: this.props.route.params?.visitPictures
    });
  };

  deletePicture = () => {
    // visit does not actually exist
    const currentPicture = this.props.route.params?.currentPicture;
    if (this.props.route.params?.visitId === '') {
      this.props.navigation.navigate('AddEvent', { pictureUri: currentPicture.uri });
    } else {
      this.props.navigation.navigate('VisitDescription', { pictureId: currentPicture.id });
    }
  };

  // _onLoad = () => {
  //   console.log("loaded")
  //   // this.setState(() => ({ loaded: true }))
  // }

  renderSvg() {
    const currentPicture = this.props.route.params?.currentPicture;
    return (
      <Svg height="100%" width="100%" style={{ backgroundColor: 'transparent' }}>
        {/* <Spinner
                          // visibility of Overlay Loading Spinner
          visible={this.state.loading}
                          // Text with the Spinner
          textContent="Loading"
                          // Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        /> */}
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={`${currentPicture.uri}`}
          // test={this._onLoad()}
        />
        <Circle
          cx={currentPicture.locationX || -100}
          cy={currentPicture.locationY || -100}
          r={currentPicture.diameter || 20}
          strokeWidth="2"
          stroke="red"
          fill="none"
        />
      </Svg>
    );
  }

  render() {
    const currentPicture = this.props.route.params?.currentPicture;
    const pictureLocation = currentPicture.location;
    const pictureBodyPart = currentPicture.bodyPart;
    const pictureNote = currentPicture.note;
    const pictureId = currentPicture.id;
    const pictureUri = currentPicture.uri;
    const visitId = this.props.route.params?.visitId;
    return (
      <Provider>
        <Portal>
          <Dialog
            visible={this.state.showNoteDialog}
            onDismiss={this._hideDialog}
          >
            <Dialog.Title style={{ fontSize: 20, fontFamily: 'Avenir-Light' }}>Picture Notes</Dialog.Title>
            <Dialog.Content>
              <Text style={{ fontSize: 18, fontFamily: 'Avenir-Light' }}>Location:</Text>
              <Text style={{
                fontSize: 15, fontStyle: 'normal', color: Colors.grey700, fontFamily: 'Avenir-Light'
              }}
              >
                {`${pictureLocation
                || 'No location specified'}`}
              </Text>
              <Text style={{ fontSize: 18, fontFamily: 'Avenir-Light' }}>Body Part:</Text>
              <Text style={{
                fontSize: 15, fontStyle: 'normal', color: Colors.grey700, fontFamily: 'Avenir-Light'
              }}
              >
                {`${pictureBodyPart
                || 'No body part specified'}`}
              </Text>
              <Text style={{ fontSize: 18, fontFamily: 'Avenir-Light' }}>Picture Notes:</Text>
              <Text style={{
                fontSize: 15, fontStyle: 'normal', color: Colors.grey700, fontFamily: 'Avenir-Light'
              }}
              >
                {`${pictureNote || 'No notes have been entered'}`}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button color="#0A2B66" onPress={this._hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{ display: 'flex', flex: 1 }}>
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
            centerComponent={{
              text: 'Photo',
              style: styles.headerCenter
            }}
            rightComponent={{
              text: 'Retake',
              style: { color: '#fff', fontSize: 16, fontFamily: 'Avenir-Light' },
              onPress: () => this.props.navigation.navigate('Camera', {
                visitId,
                pictureUri,
                pictureId
              })
            }}
          />

          <View style={{ flex: 1 }}>
            <ImageZoom
              cropWidth={Dimensions.get('window').width}
              cropHeight={
                        Dimensions.get('window').height - IMAGE_CROP_HEIGHT
                      }
              imageWidth={Dimensions.get('window').width}
              imageHeight={
                        Dimensions.get('window').height - IMAGE_CROP_HEIGHT
                      }
            >
              {this.renderSvg()}
            </ImageZoom>
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
              onPress={this.deletePicture}
            >
              <MaterialCommunityIcons
                size={35}
                style={{ paddingTop: 10 }}
                name="delete"
                color="white"
              />
              <Text
                style={{
                  textAlign: 'center', color: '#fff', paddingBottom: 15, fontSize: 14, fontFamily: 'Avenir-Light'
                }}
              >
                Delete
                {' '}
                {'\n'}
                {' '}
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
                name="note"
                style={{ paddingTop: 10 }}
                color="white"
              />
              <Text
                style={{
                  textAlign: 'center', color: '#fff', paddingBottom: 15, fontSize: 14, fontFamily: 'Avenir-Light'
                }}
              >
                View
                {' '}
                {' '}
                {'\n'}
                {' '}
                {' '}
                Photo Notes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center'
              }}
              onPress={() => this.overlayPicture('photo')}
            >
              <MaterialCommunityIcons
                size={35}
                name="picture-in-picture-bottom-right"
                style={{ paddingTop: 10 }}
                color="white"
              />
              <Text
                style={{
                  textAlign: 'center', color: '#fff', paddingBottom: 15, fontSize: 14, fontFamily: 'Avenir-Light'
                }}
              >
                Photo
                {' '}
                {'\n'}
                {' '}
                Overlay
              </Text>
            </TouchableOpacity>
            {visitId !== '' && (
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center'
              }}
              onPress={() => this.overlayPicture('anatomic')}
            >
              <MaterialCommunityIcons
                size={35}
                name="human"
                style={{ paddingTop: 10 }}
                color="white"
              />
              <Text
                style={{
                  textAlign: 'center', color: '#fff', paddingBottom: 15, fontSize: 14, fontFamily: 'Avenir-Light'
                }}
              >
                Anatomic Overlay
              </Text>
            </TouchableOpacity>
            )}
          </View>
        </View>
      </Provider>
    );
  }
}

export default PhotoScreen;
