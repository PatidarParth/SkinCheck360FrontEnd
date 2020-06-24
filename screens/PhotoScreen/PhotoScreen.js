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
import { connect } from 'react-redux';
import ImageZoom from 'react-native-image-pan-zoom';
import * as FileSystem from 'expo-file-system';
import { deletePicture } from '../../redux/actions';
import styles from './styles';

const IMAGE_CROP_HEIGHT = Platform.OS === 'ios' ? 141 : 220;

class PhotoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoteDialog: false
    };
  }

  _hideDialog = () => {
    this.setState({ showNoteDialog: false });
  };

  _showDialog = () => this.setState({ showNoteDialog: true });

  overlayPicture = () => {
    this.props.navigation.navigate('Camera', {
      visitId: this.props.route.params?.visitId,
      overlayPictureId: this.props.route.params?.pictureId,
      visitPictures: this.props.route.params?.visitPictures
    });
  };

  deletePicture = () => {
    // visit does not actually exist
    pictureURI = this.props.route.params?.pictureUri;
    if (this.props.route.params?.visitId === '') {
      this.props.navigation.navigate('AddEvent', { pictureUri: pictureURI });
    }
    // visit already exist
    else {
      this.props.deletePicture(
        this.props.visitData,
        this.props.route.params?.visitId,
        this.props.route.params?.pictureUri
      );
    }
  };

  renderSvg() {
    const visitId = this.props.route.params?.visitId;
    const pictureId = this.props.route.params?.pictureId;
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

    return (
      <Svg height="100%" width="100%" style={{ backgroundColor: 'transparent' }}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={`${FileSystem.documentDirectory}${currentPicture.uri}` || ''}
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
    let pictureUri = this.props.route.params?.pictureUri;
    let pictureNote = '';
    let pictureLocation = '';
    let pictureBodyPart = '';
    const pictureId = this.props.route.params?.pictureId;
    const visitId = this.props.route.params?.visitId;
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
    let textNoteStyle = { fontStyle: 'normal', color: Colors.blue800, fontFamily: 'Avenir-Light' };
    if (!pictureNote) {
      textNoteStyle = { fontStyle: 'normal', color: Colors.grey500, fontFamily: 'Avenir-Light' };
    }
    if (currentPicture) {
      pictureUri = currentPicture.uri;
      pictureLocation = currentPicture.pictureLocation;
      pictureBodyPart = currentPicture.pictureBodyPart;
      pictureNote = currentPicture.pictureNote;
    } else {
      this.props.navigation.goBack();
    }
    return (
      <Provider>
        <Portal>
          <Dialog
            visible={this.state.showNoteDialog}
            onDismiss={this._hideDialog}
          >
            <Dialog.Title style={{ fontFamily: 'Avenir-Light' }}>Note</Dialog.Title>
            <Dialog.Content>
              <Text style={textNoteStyle}>
                {`Location: ${pictureLocation
                || 'No location specified'}`}
              </Text>
              <Text style={textNoteStyle}>
                {`Body Part: ${pictureBodyPart
                || 'No body part specified'}`}
              </Text>
              <Text style={textNoteStyle}>
                {`Notes: ${pictureNote || 'No notes have been entered'}`}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>Done</Button>
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
                  color: '#fff', paddingBottom: 10, fontSize: 16, fontFamily: 'Avenir-Light'
                }}
              >
                Delete
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
                  color: '#fff', paddingBottom: 10, fontSize: 16, fontFamily: 'Avenir-Light'
                }}
              >
                View Note
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center'
              }}
              onPress={this.overlayPicture}
            >
              <MaterialCommunityIcons
                size={35}
                name="picture-in-picture-bottom-right"
                style={{ paddingTop: 10 }}
                color="white"
              />
              <Text
                style={{
                  color: '#fff', paddingBottom: 10, fontSize: 16, fontFamily: 'Avenir-Light'
                }}
              >
                Overlay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoScreen);
