// Aboutscreen.js
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
import { deletePicture } from '../../redux/actions';
import styles from './styles';

class PhotoScreen extends Component {
  static navigationOptions = {
    header: null
  };

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
      this.props.navigation.navigate('AddPhotos', {
        visitId: this.props.navigation.getParam('visitId'),
        overlayPictureId: this.props.navigation.getParam('pictureId'),
        visitPictures: this.props.navigation.getParam('visitPictures')
      });
  };

  deletePicture = () => {
    //visit does not actually exist
    pictureURI = this.props.navigation.getParam('pictureUri')
    if (this.props.navigation.getParam('visitId') == '') {
      this.props.navigation.navigate('AddEvent', {
        pictureUri: pictureURI
      });
    }
    //visit already exist 
    else {
      this.props.deletePicture(
        this.props.visitData,
        this.props.navigation.getParam('visitId'),
        this.props.navigation.getParam('pictureUri')
      );
    }
  };

  renderSvg() {
    const visitId = this.props.navigation.getParam('visitId');
    const pictureId = this.props.navigation.getParam('pictureId');
    let currentPicture = [];
    if (visitId === '') {
      currentPicture = this.props.navigation.getParam('visitPictures').find(
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
      <Svg height="100%" width="100%" style={{ backgroundColor: '#33AAFF' }}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          href={currentPicture.uri || ''}
        />
        <Circle
          cx={currentPicture.locationX || -100}
          cy={currentPicture.locationY || -100}
          r={currentPicture.diameter || 20}
          strokeWidth="4"
          stroke="red"
          fill="none"
        />
      </Svg>
    );
  }

  render() {
    let pictureUri = this.props.navigation.getParam('pictureUri');
    let pictureNote = '';
    let pictureLocation = '';
    let pictureBodyPart = '';
    const pictureId = this.props.navigation.getParam('pictureId');
    const visitId = this.props.navigation.getParam('visitId');
    let currentPicture = [];
    if (visitId === '') {
      currentPicture = this.props.navigation.getParam('visitPictures').find(
        (data) => data.pictureId === pictureId
      );
    } else {
      currentPicture = this.props.visitData[visitId].visitPictures.find(
        (data) => data.pictureId === pictureId
      );
    }
    let textNoteStyle = { fontStyle: 'normal', color: Colors.blue800 };
    if (!pictureNote) {
      textNoteStyle = { fontStyle: 'italic', color: Colors.grey500 };
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
            <Dialog.Title>Note</Dialog.Title>
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
              style: { fontSize: 20, color: '#fff', top: 0 }
            }}
            rightComponent={{
              text: 'Retake',
              style: { color: '#fff', fontSize: 16 },
              onPress: () => this.props.navigation.navigate('AddPhotos', {
                visitId,
                pictureUri,
                pictureId
              })
            }}
          />

          <View style={{ flex: 1 }}>{this.renderSvg()}</View>
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
                style={{padding: 10}}
                name="delete"
                color="white"
              />
              <Text
                color="#FFF"
                style={{ color: '#fff', paddingBottom: 30, fontSize: 16 }}
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
                name="autorenew"
                style={{padding: 10}}
                color="white"
              />
              <Text
                color="#FFF"
                style={{ color: '#fff', paddingBottom: 30, fontSize: 16 }}
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
                style={{padding: 10}}
                color="white"
              />
              <Text
                color="#FFF"
                style={{ color: '#fff', paddingBottom: 30, fontSize: 16 }}
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
