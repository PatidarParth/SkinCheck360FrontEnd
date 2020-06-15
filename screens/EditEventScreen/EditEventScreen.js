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
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import { Appearance } from 'react-native-appearance';
import { addVisit } from '../../redux/actions';
import styles from './styles';

const colorScheme = Appearance.getColorScheme();
class EditEventScreen extends Component {
  subscription;

  constructor(props) {
    super(props);
    this.state = {
      visitId: '',
      visitName: '',
      isDateTimePickerVisible: false,
      visitDate: Date.now(),
      visitPictures: [],
      visitNotes: '',
      edit: false,
      isDarkModeEnabled: colorScheme === 'dark',
      visitTitleError: ''
    };
  }

  componentDidMount() {
    const visitId = this.props.route.params?.visitId;
    this.setState({
      visitId,
      visitName: this.props.visitData[visitId].visitName,
      visitDate: this.props.visitData[visitId].visitDate,
      visitNotes: this.props.visitData[visitId].visitNotes,
      visitPictures: this.props.visitData[visitId].visitPictures,
      edit: true
    });

    // eslint-disable-next-line no-undef
    subscription = Appearance.addChangeListener(
      ({ colorScheme: _colorScheme }) => {
        this.setState({ isDarkModeEnabled: _colorScheme === 'dark' });
      }
    );
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    if (subscription) subscription.remove();
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
      const id = this.state.edit ? this.state.visitId : uuidv4();
      this.props.addVisit(
        this.props.visitData,
        id,
        this.state.visitName,
        new Date(this.state.visitDate).toString(),
        this.state.visitNotes,
        this.state.visitPictures
      );
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

const mapStateToProps = (state) => ({
  visitData: state.visits.visits.visitData,
  visits: state.visits
});

const mapDispatchToProps = (dispatch) => ({
  addVisit: (visitData, id, name, created, information, pictures) => {
    dispatch(addVisit(visitData, id, name, created, information, pictures));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);
