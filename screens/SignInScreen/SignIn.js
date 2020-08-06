import React from 'react';
import {
  View, TouchableOpacity, Text, Image, TextInput, Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Auth } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SignIn } from 'aws-amplify-react-native';
import * as SecureStore from 'expo-secure-store';
import styles from './styles';

class SignInScreen extends SignIn {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      compatible: false,
      showTouchId: false,
    };
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

 handlePassword = (text) => {
   this.setState({ password: text });
 }

 checkDeviceForHardware = async () => {
   const isTouchIdEnabled = await SecureStore.getItemAsync('isTouchIdEnabled', { keychainService: 'iOS' });
   if (isTouchIdEnabled === 'true') {
     const compatible = await LocalAuthentication.hasHardwareAsync();
     this.setState({ compatible: true });
     if (compatible) {
       this.checkForBiometrics();
     }
   } else {
     this.setState({ compatible: false });
   }
 };

checkForBiometrics = async () => {
  const biometricRecords = await LocalAuthentication.isEnrolledAsync();
  if (!biometricRecords) {
    this.setState({ showTouchId: false });
  } else {
    this.setState({ showTouchId: true });
    this.scanBiometrics();
  }
};

scanBiometrics = async () => {
  const username = await SecureStore.getItemAsync('SkinCheck360KeyChainAuthUsername', { keychainService: 'iOS' });
  const password = await SecureStore.getItemAsync('SkinCheck360KeyChainAuthPassword', { keychainService: 'iOS' });
  const { onStateChange } = this.props;
  const result = await LocalAuthentication.authenticateAsync({ promptMessage: `Sign in as ${username.slice(0, 2)}***** using Touch ID` });
  if (result.success) {
    await Auth.signIn(username, password);
    onStateChange('signedIn');
  } else {
    Alert.alert('Please enter your username and password');
  }
};

componentDidMount() {
  this.checkDeviceForHardware();
}

// eslint-disable-next-line react/sort-comp
async signIn() {
  const { username } = this.state;
  const { password } = this.state;
  const { onStateChange } = this.props;
  if (!username) {
    this.setState({ error: 'Username or Password is incorrect.' });
    return;
  }
  try {
    await SecureStore.setItemAsync('SkinCheck360KeyChainAuthUsername', username, { keychainService: 'iOS' });
    await SecureStore.setItemAsync('SkinCheck360KeyChainAuthPassword', password, { keychainService: 'iOS' });
    await Auth.signIn(username, password);
    onStateChange('signedIn');
  } catch (err) {
    if (err.code === 'UserNotConfirmedException') {
      await Auth.resendSignUp(username);
      onStateChange('confirmSignUp');
    } else if (err.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
      this.setState({ error: 'Username or Password is incorrect.' });
    } else if (err.code === 'InvalidParameterException') {
      // The error happens when the pw is empty
      this.setState({ error: 'Username or Password is incorrect.' });
    } else {
      this.setState({ error: 'Username or Password is incorrect.' });
    }
  }
}

canBeSubmitted() {
  const { username, password } = this.state;
  return (
    username.length > 0
    && password.length > 0
  );
}

navigateForgotPW() {
  this.setState({ username: '' });
  this.setState({ password: '' });
  this.setState({ error: '' });
  this.props.onStateChange('forgotPassword');
}

navigateSignUp() {
  this.setState({ username: '' });
  this.setState({ password: '' });
  this.setState({ error: '' });
  this.props.onStateChange('signUp');
}

render() {
  const { authState } = this.props;
  const { showTouchId, compatible } = this.state;
  const isEnabled = this.canBeSubmitted();
  if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <Text style={styles.sectionText}>Skin Check 360</Text>
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
          placeholderStyle={styles.input}
          onChangeText={this.handleUsername}
          keyboardType="email-address"
          autoCorrect={false}
        />
        <Text style={styles.inputLabel}>Password*</Text>
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
        <View style={styles.signInButtonView}>
          <TouchableOpacity
            style={!isEnabled ? styles.disableButton : styles.button}
            onPress={() => this.signIn()}
            disabled={!isEnabled}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          {showTouchId && compatible && (
            <TouchableOpacity
              onPress={this.checkForBiometrics}
              disabled={this.props.compatible}
            >
              <MaterialCommunityIcons
                name="fingerprint"
                size={40}
                style={styles.inputIcon}
                color="#0A2B66"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.sectionFooterLabel} onPress={() => this.navigateForgotPW()}>Forgot Password</Text>
          <Text style={styles.sectionFooterLabel} onPress={() => this.navigateSignUp()}>Sign Up</Text>
        </View>
        <Text style={styles.errorLabel}>{this.state.error}</Text>
      </KeyboardAwareScrollView>
      <Text style={styles.termsLabel}>By signing in, you are agreeing to Skin Check 360 Terms & Conditions</Text>
    </View>
  );
}
}

export default (SignInScreen);
