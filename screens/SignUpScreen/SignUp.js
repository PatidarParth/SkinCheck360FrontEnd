import React from 'react';
import {
  View, TouchableOpacity, Text, Image, TextInput
} from 'react-native';

import { Auth } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignUp } from 'aws-amplify-react-native';
import styles from './styles';

class SignUpScreen extends SignUp {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      phone_number: '',
      address: '',
      error: ''
    };
  }

  handleName = (text) => {
    this.setState({ name: text });
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

  handleEmail = (text) => {
    this.setState({ email: text });
  }

  handlePhoneNumber = (text) => {
    this.setState({ phone_number: `+1${text}` });
  }

  handleAddress = (text) => {
    this.setState({ address: text });
  }

 handlePassword = (text) => {
   this.setState({ password: text });
 }

 // eslint-disable-next-line react/sort-comp
 async signUp() {
   // eslint-disable-next-line camelcase
   const {
     username, password, email, phone_number, address, name
   } = this.state;
   const { onStateChange } = this.props;
   // name check
   if (/[^a-zA-Z]/.test(name)) {
     this.setState({ error: 'Name cannot have numbers or symbols.' });
     return;
   }
   // username check
   if (/[^0-9a-zA-Z]/.test(username)) {
     this.setState({ error: 'Username cannot have symbols.' });
     return;
   }
   // password check
   if (password.length < 8 && !(/^(^[\\S]+.*[\\S]+$")$/.test(password))) {
     // eslint-disable-next-line max-len
     this.setState({ error: 'Password length must be greater than 6 and Password must have atleast one uppercase, one lowercase, one number, and one symbol.' });
     return;
   }
   try {
     await Auth.signUp({
       username,
       password,
       attributes: {
         email, phone_number, name, address
       }
     });
     onStateChange('confirmSignUp');
   } catch (err) {
     console.log(err);
     if (err.code === 'UserNotConfirmedException') {
       this.props.updateUsername(username);
       await Auth.resendSignUp(username);
       this.props.onStateChange('confirmSignUp', {});
       this.setState({ error: 'Please confirm sign up.' });
     } else if (err.message === 'Invalid email address format.') {
       // The error happens when email format is wrong
       this.setState({ error: 'Email Address format is invalid' });
     } else if (err.message === 'Invalid phone number format.') {
       // The error happens when phone number format is wrong
       this.setState({ error: 'Phone Number format is invalid' });
     } else {
       this.setState({ error: 'Please try again later.' });
     }
   }
 }

 canBeSubmitted() {
   const {
     // eslint-disable-next-line camelcase
     username, password, email, phone_number, address, name
   } = this.state;
   return (
     username.length > 0
   && password.length > 0 && email.length > 0
   && phone_number.length > 0 && address.length > 0
   && name.length > 0
   );
 }

 navigateConfirmSignUp() {
   this.setState({ error: '' });
   this.setState({ username: '' });
   this.setState({ password: '' });
   this.setState({ name: '' });
   this.setState({ email: '' });
   this.setState({ phone_number: '' });
   this.setState({ address: '' });
   this.props.onStateChange('confirmSignUp');
 }

 navigateSignIn() {
   this.setState({ error: '' });
   this.setState({ username: '' });
   this.setState({ password: '' });
   this.setState({ name: '' });
   this.setState({ email: '' });
   this.setState({ phone_number: '' });
   this.setState({ address: '' });
   this.props.onStateChange('signIn');
 }

 render() {
   const { authState } = this.props;
   const isEnabled = this.canBeSubmitted();
   if (!['signUp'].includes(authState)) { return null; }
   return (
     <View style={styles.container}>
       <KeyboardAwareScrollView>
         <Text style={styles.sectionText}>Join Skin Check 360</Text>
         <Image
          // eslint-disable-next-line global-require
           source={require('../../assets/TransparentLogo.png')}
           style={styles.logo}
         />
         <Text style={styles.inputLabel}>Name*</Text>
         <TextInput
           style={styles.input}
           placeholder="Enter First and Last Name"
           autoCapitalize="none"
           placeholderStyle={styles.input}
           onChangeText={this.handleName}
           autoCorrect={false}
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
         <Text style={styles.inputLabel}>Email*</Text>
         <TextInput
           style={styles.input}
           placeholder="Enter Email"
           autoCapitalize="none"
           placeholderStyle={styles.input}
           onChangeText={this.handleEmail}
           keyboardType="email-address"
           autoCorrect={false}
         />
         <Text style={styles.inputLabel}>Phone Number*</Text>
         <TextInput
           style={styles.input}
           placeholder="Enter Phone Number"
           autoCapitalize="none"
           placeholderStyle={styles.input}
           onChangeText={this.handlePhoneNumber}
           keyboardType="number-pad"
           autoCorrect={false}
           maxLength={10}
         />
         <Text style={styles.inputLabel}>Password*</Text>
         <TextInput
           style={styles.input}
           placeholder="Enter your password"
           placeholderStyle={styles.input}
           autoCapitalize="none"
           onChangeText={this.handlePassword}
           type="password"
           autoCorrect={false}
           secureTextEntry
         />
         <Text style={styles.inputLabel}>Address*</Text>
         <TextInput
           style={styles.input}
           placeholder="Enter Clinic Address"
           autoCapitalize="none"
           placeholderStyle={styles.input}
           onChangeText={this.handleAddress}
           autoCorrect={false}
         />
         <TouchableOpacity
           style={!isEnabled ? styles.disableButton : styles.button}
           onPress={() => this.signUp()}
           disabled={!isEnabled}
         >
           <Text style={styles.buttonText}>Sign Up </Text>
         </TouchableOpacity>
         <View style={styles.footerRow}>
           <Text style={styles.sectionFooterLabel} onPress={() => this.navigateConfirmSignUp()}>Confirm a Code</Text>
           <Text style={styles.sectionFooterLabel} onPress={() => this.navigateSignIn()}>Sign In</Text>
         </View>
         <Text style={styles.errorLabel}>{this.state.error}</Text>
         <Text style={styles.termsLabel}>By signing up, you are agreeing to Skin Check 360 Terms & Conditions</Text>
       </KeyboardAwareScrollView>
     </View>
   );
 }
}

export default (SignUpScreen);
