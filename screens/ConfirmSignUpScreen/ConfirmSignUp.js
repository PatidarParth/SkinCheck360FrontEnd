import React from 'react';
import {
  View, TouchableOpacity, Text, ScrollView, Image, TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Auth } from 'aws-amplify';
import { ConfirmSignUp } from 'aws-amplify-react-native';
import styles from './styles';


class ConfirmSignUpScreen extends ConfirmSignUp {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      code: '',
      error: ''
    };
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

  handleConfirmationCode = (text) => {
    this.setState({ code: text });
  }

  // eslint-disable-next-line react/sort-comp
  async resendCode() {
    const { username } = this.state;
    if (!username) {
      this.setState({ error: 'Username cannot be empty.' });
      return;
    }
    try {
      await Auth.resendSignUp(username);
      this.setState({ error: 'Verfication Code has been sent!' });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  // eslint-disable-next-line react/sort-comp
  async ConfirmSignUp() {
    const { username } = this.state;
    const { code } = this.state;
    if (!username || !code) {
      this.setState({ error: 'Please fill out all information' });
    } else {
      const { onStateChange } = this.props;
      try {
        await Auth.confirmSignUp(username, code);
        onStateChange('signIn');
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
  }


  render() {
    const { authState } = this.props;
    if (!['confirmSignUp'].includes(authState)) { return null; }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <Text style={styles.sectionText}>Confirm Email</Text>
          <Image
          // eslint-disable-next-line global-require
            source={require('../../assets/TransparentLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.inputLabel}>Username*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            autoCapitalize="none"
            onChangeText={this.handleUsername}
            keyboardType="email-address"
            autoCorrect={false}
          />
          <Text style={styles.inputLabel}>Confirmation Code*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Confirmation Code"
            autoCapitalize="none"
            onChangeText={this.handleConfirmationCode}
            keyboardType="numeric"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.ConfirmSignUp()}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <View style={styles.footerRow}>
            <Text style={styles.sectionFooterLabel} onPress={() => this.resendCode()}>Resend Code</Text>
            <Text style={styles.sectionFooterLabel} onPress={() => this.props.onStateChange('signIn')}>Back to Sign In</Text>
          </View>
          <Text style={styles.errorLabel}>{this.state.error}</Text>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default (ConfirmSignUpScreen);
