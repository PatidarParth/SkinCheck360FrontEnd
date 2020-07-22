import React from 'react';
import {
  View, TouchableOpacity, Text, Image, TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Auth } from 'aws-amplify';
import { ForgotPassword } from 'aws-amplify-react-native';
import styles from './styles';


class ForgotPasswordScreen extends ForgotPassword {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: '',
      code: '',
      password: '',
      sent: null
    };
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

  handleCode = (text) => {
    this.setState({ code: text });
  }

  handlePassword = (text) => {
    this.setState({ password: text });
  }

  canBeSubmitted1() {
    const { username } = this.state;
    return (
      username.length > 0
    );
  }

  canBeSubmitted2() {
    const { code, password } = this.state;
    return (
      code.length > 0
      && password.length > 0
    );
  }

  // eslint-disable-next-line react/sort-comp
  async ForgotPassword() {
    const { username } = this.state;
    const { onStateChange } = this.props;
    if (!username) {
      this.setState({ error: 'Username cannot be empty.' });
      return;
    }
    try {
      await Auth.forgotPassword(username);
      onStateChange('forgotPassword');
      this.setState({ sent: 'sent' });
      this.setState({ error: '' });
    } catch (err) {
      console.log(err);
      if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        this.setState({ error: 'Username not found.' });
      } else if (err.code === 'InvalidParameterException') {
        // The error happens when the pw is empty
        this.setState({ error: 'All fields must be filled.' });
      } else {
        this.setState({ error: 'Limit Reached. Please try again later.' });
      }
    }
  }

  async submit() {
    const { code, password, username } = this.state;
    const { onStateChange } = this.props;
    if (!username || !password || !code) {
      this.setState({ error: 'All fields must be filled.' });
      return;
    }
    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      onStateChange('signIn');
    } catch (err) {
      if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        this.setState({ error: 'Username not found.' });
      } else if (err.code === 'InvalidParameterException') {
        // The error happens when the pw is empty
        this.setState({ error: 'All fields must be filled.' });
      } else {
        this.setState({ error: 'Limit Reached. Please try again later.' });
      }
    }
  }

  navigateSignIn() {
    this.setState({ error: '' });
    this.setState({ username: '' });
    this.setState({ code: '' });
    this.setState({ password: '' });
    this.setState({ sent: null });
    this.props.onStateChange('signIn');
  }

  render() {
    const { authState } = this.props;
    const isEnabled1 = this.canBeSubmitted1();
    const isEnabled2 = this.canBeSubmitted2();
    if (!['forgotPassword'].includes(authState)) { return null; }
    return (
      <View style={styles.container}>
        {!this.state.sent
         && (
         <View>
           <KeyboardAwareScrollView>

             <Text style={styles.sectionText}>Enter Username for Reset Email</Text>
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
             <TouchableOpacity
               style={!isEnabled1 ? styles.disableButton : styles.button}
               onPress={() => this.ForgotPassword()}
               disabled={!isEnabled1}
             >
               <Text style={styles.buttonText}>Send</Text>
             </TouchableOpacity>
             <Text style={styles.sectionFooterLabel} onPress={() => this.navigateSignIn()}>Back to Sign In</Text>
             <Text style={styles.errorLabel}>{this.state.error}</Text>
           </KeyboardAwareScrollView>
         </View>
         )}
        {this.state.sent
         && (
         <View>
           <KeyboardAwareScrollView>

             <Text style={styles.sectionText}>Reset your Password</Text>
             <Image
           // eslint-disable-next-line global-require
               source={require('../../assets/TransparentLogo.png')}
               style={styles.logo}
             />
             <Text style={styles.inputLabel}>Confirmation Code*</Text>
             <TextInput
               style={styles.input}
               placeholder="Enter Confirmation Code"
               autoCapitalize="none"
               onChangeText={this.handleCode}
               autoCorrect={false}
             />
             <Text style={styles.inputLabel}>New Password*</Text>
             <TextInput
               style={styles.input}
               placeholder="Enter Password"
               placeholderStyle={styles.input}
               autoCapitalize="none"
               onChangeText={this.handlePassword}
               type="password"
               autoCorrect={false}
               secureTextEntry
             />
             <TouchableOpacity
               style={!isEnabled2 ? styles.disableButton : styles.button}
               onPress={() => this.submit()}
               disabled={!isEnabled2}
             >
               <Text style={styles.buttonText}>Submit</Text>
             </TouchableOpacity>
             <View style={styles.footerRow}>
               <Text style={styles.sectionFooterLabel} onPress={() => this.ForgotPassword()}>Resend Code</Text>
               <Text style={styles.sectionFooterLabel} onPress={() => this.navigateSignIn()}>Back to Sign In</Text>
             </View>
             <Text style={styles.errorLabel}>{this.state.error}</Text>
           </KeyboardAwareScrollView>
         </View>
         )}
      </View>
    );
  }
}

export default (ForgotPasswordScreen);
