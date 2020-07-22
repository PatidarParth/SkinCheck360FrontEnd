import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text, Image, TextInput
} from 'react-native';

import { Auth } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignIn } from 'aws-amplify-react-native';
import styles from './styles';

class SignInScreen extends SignIn {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

 handlePassword = (text) => {
   this.setState({ password: text });
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
   console.log(username);
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
         <TouchableOpacity
           style={!isEnabled ? styles.disableButton : styles.button}
           onPress={() => this.signIn()}
           disabled={!isEnabled}
         >
           <Text style={styles.buttonText}>Sign In</Text>
         </TouchableOpacity>
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
