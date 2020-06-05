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
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deletePicture, addPicture } from '../../redux/actions';
import styles from './styles';

class PhotosScreen extends Component {
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
    this.setState({ visitId: this.props.navigation.getParam('visitId') });
  }

  view = () => {
    this.setState({ visible: false });

    this.props.navigation.navigate('Photo', {
      visitId: this.state.visitId,
      pictureId: this.state.selectedPicture.pictureId,
      pictureUri: this.state.selectedPicture.uri,
      pictureNote: this.state.selectedPicture.pictureNote,
      pictureLocation: this.state.selectedPicture.pictureLocation,
      pictureBodyPart: this.state.selectedPicture.pictureBodyPart,
      visitPictures: this.state.visitPictures
    });
  };

  overlayPicture = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate('AddPhotos', {
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

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  navigateToCamera = () => {
    this.setState({ addNewMenuVisible: false });
    this.props.navigation.navigate('AddPhotos', {
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
      if (result && result.uri) {
        this.props.addPicture(
          this.props.visitData,
          this.props.navigation.getParam('visitId'),
          result.uri,
          '',
          '',
          '',
          undefined,
          -100,
          -100,
          20
        );
      }
    }
  };

  render() {
    let visitPictures = [];
    if (this.props.visitData[
      this.props.navigation.getParam('visitId')
    ] !== 'undefined') {
      visitPictures = this.props.visitData[
        this.props.navigation.getParam('visitId').visitPictures
      ];
    }
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
          centerComponent={{ text: 'Add Pictures', style: styles.headerCenter }}
        />
        <Provider>
          <ScrollView>
            <View style={styles.scrollView}>
              {(!visitPictures
                || (visitPictures && visitPictures.length === 0)) && (
                  <View style={styles.innerSpacer}>
                    <View style={styles.notificationView}>
                      <Text style={styles.notificationText}>
                          No Pictures Currently
                      </Text>
                    </View>
                  </View>
              )}
              {visitPictures
                && visitPictures.length > 0
                && visitPictures.map((picture, i) => (
                  <TouchableOpacity
                    key={`picture-${i}`}
                    style={styles.pictureButton}
                    onPress={() => this.props.navigation.navigate('Photo', {
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
                      <Text color="#FFF">{picture.dateCreated}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
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
              {visitPictures
                && visitPictures.length > 0 && (
                <View style={styles.buttonSave}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => this.savePictures()}
                  >
                    <Text style={styles.primaryText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotosScreen);
