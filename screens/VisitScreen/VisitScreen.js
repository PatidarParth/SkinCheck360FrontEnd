// Aboutscreen.js
import React, { Component } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, YellowBox
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import {
  Menu, Divider, Provider, IconButton
} from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import styles from './styles';
import { deletePicture, getVisitEntry, createPicture } from '../../graphQL/queries';

class VisitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedPicture: {},
      x: 0,
      y: 0,
      newPicturesToAdd: [],
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

  componentDidMount = async () => {
    // get photos object
    const photosItems = this.props.route.params?.item.pictures.items;
    await this.fetchPictures(photosItems);
  }

  componentDidUpdate = async (oldProps) => {
    const newProps = this.props;
    if ((this.props.route.params?.pictureId !== undefined) && (this.props.route.params?.pictureId === this.state.selectedPicture.id)) {
      await this.deletePicture(this.state.selectedPicture);
    } else if (oldProps.route.params?.pictureArray !== newProps.route.params?.pictureArray) {
      if (newProps.route.params?.pictureArray !== undefined && newProps.route.params?.pictureArray.length > 0) {
        // edit the pic with new pic
        if (this.state.newPicturesToAdd.find((e) => e.id === newProps.route.params?.picId)) {
          const updatedArray = update(
            this.state.newPicturesToAdd, {
              $splice: [[this.state.newPicturesToAdd.findIndex((e) => e.id === newProps.route.params?.picId), 1,
                newProps.route.params?.pictureArray[0]]]
            }
          ); // array.splice(start, deleteCount, item1)
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(() => ({ newPicturesToAdd: updatedArray }));
        // new pic first time
        } else {
          this.state.newPicturesToAdd.push(newProps.route.params?.pictureArray[0]);
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState((prevState) => ({ newPicturesToAdd: prevState.newPicturesToAdd }));
        }
      }
    }
  }

  fetchPictures = async (pictureObject) => {
    if (pictureObject.length > 0) {
      await Promise.all(pictureObject.map(async (item) => {
        const { key } = item.fullsize;
        const uri = await Storage.get(key.substring(5).slice(0, -1));
        Object.assign(item, { uri });
      }));
      this.setState({ visitPictures: pictureObject });
    } else {
      this.setState({ visitPictures: [] });
    }
  }

  viewIndividualPhoto = (picture) => {
    this.setState({ visible: false, selectedPicture: picture });
    this.props.navigation.navigate('ViewPhoto', {
      visitId: this.props.route.params?.item.id,
      currentPicture: picture,
      visitPictures: this.state.visitPictures
    });
  };


  overlayPicture = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate('Camera', {
      visitId: this.props.route.params?.item.id,
      overlayPicture: this.state.selectedPicture,
      visitPictures: this.state.visitPictures
    });
  };

  navigateToCamera = () => {
    this.props.navigation.navigate('Camera', {
      visitId: this.props.route.params?.item.id
    });
  };

  savePictures = () => {
    this.props.navigation.navigate('Home');
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
        this.state.newPicturesToAdd.push({
          id: uuidv4(),
          uri: result.uri,
          note: '',
          location: '',
          bodyPart: '',
          locationX: -100,
          locationY: -100,
          diameter: -20,
          dateCreated: Moment().format('MM/DD/YYYY hh:mm A'),
          faceDetectedValues: []
        });
        this.setState((prevState) => ({ newPicturesToAdd: prevState.newPicturesToAdd }));
      }
    }
  };

  deletePicture = async (selectedPicture) => {
    // temporary picture delete
    if (selectedPicture.temporary !== undefined) {
      this.setState({ visible: false, selectedPicture: [] });
      this.setState((prevState) => ({ newPicturesToAdd: prevState.newPicturesToAdd.filter((item) => item.uri !== selectedPicture.uri) }));
    } else {
      // delete from dynamo
      await API.graphql(graphqlOperation(deletePicture, { pictureId: this.state.selectedPicture.id }));
      // delete from s3
      await Storage.remove(`uploads/${this.props.route.params?.item.id}/${this.state.selectedPicture.id}`);
      // fetch pictures again to refresh
      const updatedVisitEntry = await API.graphql(graphqlOperation(getVisitEntry, { visitId: this.props.route.params?.item.id }));
      // fetch update pictures object now
      this.fetchPictures(updatedVisitEntry.data.getVisitEntry.pictures.items);
      this.setState({ visible: false, selectedPicture: '{}' });
    }
  }

  saveNewPics = async () => {
    const { newPicturesToAdd } = this.state;
    if (newPicturesToAdd.length > 0) {
      // upload each picture to s3
      newPicturesToAdd.forEach(async (element) => {
        const response = await fetch(element.uri);
        const blob = await response.blob();
        const S3key = await Storage.put(
          `uploads/${this.props.route.params?.item.id}/${element.id}`,
          blob,
          {
            contentType: 'image/png',
            metadata: { visitEntryId: this.props.route.params?.item.id }
          }
        );
        await this.storeVisitPhotoInfo(S3key, element, this.props.route.params?.item.id);
      });
    }
    this.props.navigation.navigate('Home');
  };

  storeVisitPhotoInfo = async (S3key, item, visitEntryId) => {
    await API.graphql(graphqlOperation(createPicture, {
      // eslint-disable-next-line max-len
      key: S3key, pictureSize: 600, pictureId: item.id, pictureNote: item.note, pictureLocation: item.location, pictureBodyPart: item.bodyPart, picturelocationX: item.locationX, picturelocationY: item.locationY, pictureDiameter: item.diameter, pictureVisitEntryId: visitEntryId, bucket: 'skincheck360images205534-dev'
    }));
  }

  render() {
    const { visitPictures } = this.state;
    const { newPicturesToAdd } = this.state;
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
          centerComponent={{ text: this.props.route.params?.item.name, style: styles.headerCenter }}
          rightComponent={(
            <IconButton
              icon="square-edit-outline"
              style={styles.rightHeaderComponent}
              color="white"
              size={30}
              onPress={() => this.props.navigation.navigate('EditEvent', {
                ...this.props.route.params?.item
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
            value={Moment(this.props.route.params?.item.date).format(
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
            value={this.props.route.params?.item.notes}
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
            {((!visitPictures
                || (visitPictures && visitPictures.length === 0))) && ((!newPicturesToAdd
                  || (newPicturesToAdd && newPicturesToAdd.length === 0))) && (
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
                    onPress={() => this.viewIndividualPhoto(picture)}
                    onLongPress={(name) => {
                      this.setState({
                        x: name.nativeEvent.pageX,
                        y: name.nativeEvent.pageY,
                        selectedPicture: picture,
                        visible: true
                      });
                    }}
                  >
                    <View
                      key={`picture-${picture.uri}`}
                      style={{ padding: 20, height: 200 }}
                    >
                      <Image
                        source={picture.uri ? { uri: picture.uri } : null}
                        style={{ height: '100%', width: '100%' }}
                      />
                      <Text style={styles.pictureFont}>{ Moment(picture.createdAt).format('MM/DD/YYYY hh:mm A')}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              {newPicturesToAdd
                && newPicturesToAdd.length > 0
                && newPicturesToAdd.map((picture, i) => (
                  <TouchableOpacity
                    key={`picture-${i}`}
                    style={styles.pictureButton}
                    onPress={() => this.viewIndividualPhoto(picture)}
                    onLongPress={(name) => {
                      this.setState({
                        x: name.nativeEvent.pageX,
                        y: name.nativeEvent.pageY,
                        selectedPicture: picture,
                        visible: true
                      });
                    }}
                  >
                    <View
                      key={`picture-${picture.uri}`}
                      style={{ padding: 20, height: 200 }}
                    >
                      <Image
                        source={picture.uri ? { uri: picture.uri } : null}
                        style={{ height: '100%', width: '100%' }}
                      />
                      <Text style={styles.pictureFont}>{ Moment(picture.createdAt).format('MM/DD/YYYY hh:mm A')}</Text>
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
              {newPicturesToAdd
                && newPicturesToAdd.length > 0 && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => this.saveNewPics()}
                >
                  <Text style={styles.primaryText}>Save New Pictures</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
          <Menu
            visible={this.state.visible}
            onDismiss={() => this.setState({ visible: false })}
            anchor={{ x: this.state.x, y: this.state.y }}
          >
            <Menu.Item onPress={() => this.viewIndividualPhoto(this.state.selectedPicture)} title="View" />
            <Divider />
            <Menu.Item onPress={this.overlayPicture} title="Overlay" />
            <Divider />
            <Menu.Item onPress={() => this.deletePicture(this.state.selectedPicture)} title="Delete" />
          </Menu>
        </Provider>
      </View>
    );
  }
}

export default VisitScreen;
