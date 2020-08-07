import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text
} from 'react-native';
import { Input, Header } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { IconButton } from 'react-native-paper';
import Moment from 'moment';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './styles';
import { updateVisitEntry } from '../../graphQL/queries';

class EditEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitId: '',
      visitName: '',
      isDateTimePickerVisible: false,
      visitDate: Date.now(),
      visitPictures: [],
      visitNotes: '',
      visitTitleError: ''
    };
  }

  componentDidMount() {
    this.setState({
      visitId: this.props.route.params?.id,
      visitName: this.props.route.params?.name,
      visitDate: this.props.route.params?.date,
      visitNotes: this.props.route.params?.notes,
      // visitPictures: this.props.visitData[visitId].visitPictures,
    });
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

  saveVisit = async () => {
    if (this.state.visitName) {
      await API.graphql(graphqlOperation(updateVisitEntry, {
        // eslint-disable-next-line max-len
        id: this.state.visitId, name: this.state.visitName, date: Moment(this.state.visitDate).format('YYYY-MM-DDThh:mm:ss.sssZ'), notes: this.state.visitNotes
      }));
      this.props.navigation.navigate('Home');
    } else {
      this.setState(() => ({ visitTitleError: 'Visit Title is required.' }));
    }
  };

  displayDateTimePicker = (display) => this.setState({ isDateTimePickerVisible: display });

  render() {
    return (
      <View>
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
          centerComponent={{ text: 'Edit Visit Information', style: styles.headerCenter }}
        />
        <KeyboardAwareScrollView>
          <View style={styles.innerSpacer}>
            <Input
              placeholder="The name of your doctor or hospital"
              style={styles.flexGrow}
              label="Visit Title"
              inputStyle={styles.inputFont}
              labelStyle={styles.labelFont}
              errorStyle={{ color: 'red' }}
              errorMessage={this.state.visitTitleError}
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
          </View>
          <View style={styles.innerSpacer}>
            <TouchableOpacity
              onPress={() => this.displayDateTimePicker(true)}
            >
              <Input
                placeholder="The date of the visit"
                label="Visit Date"
                labelStyle={styles.labelFont}
                inputStyle={styles.inputFont}
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
              inputStyle={styles.inputFont}
              multiline
              labelStyle={styles.labelFont}
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
          <View style={styles.editButtonSave}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => this.saveVisit()}
            >
              <Text style={styles.primaryText}>Save Visit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


export default EditEventScreen;
