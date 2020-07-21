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
 async signIn() {
   const { username } = this.state;
   const { password } = this.state;
   const { email } = this.state;
   // eslint-disable-next-line camelcase
   const { phone_number } = this.state;
   const { address } = this.state;
   const { name } = this.state;
   const { onStateChange } = this.props;
   if (!username || !password || !email || !phone_number || !address || !name) {
     this.setState({ error: 'All fields must be filled out.' });
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
       this.setState({ error: 'Username or Password are incorrect.' });
     } else if (err.code === 'UserNotFoundException') {
       // The error happens when the supplied username/email does not exist in the Cognito user pool
       this.setState({ error: 'Username or Password are incorrect.' });
     } else if (err.code === 'InvalidParameterException') {
       // The error happens when the pw is empty
       this.setState({ error: 'All fields must be filled.' });
     } else {
       this.setState({ error: 'Please try again later.' });
     }
   }
 }

 render() {
   const { authState } = this.props;
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
           style={styles.button}
           onPress={() => this.signIn()}
         >
           <Text style={styles.buttonText}>Sign Up </Text>
         </TouchableOpacity>
         <View style={styles.footerRow}>
           <Text style={styles.sectionFooterLabel} onPress={() => this.props.onStateChange('confirmSignUp')}>Confirm a Code</Text>
           <Text style={styles.sectionFooterLabel} onPress={() => this.props.onStateChange('signIn')}>Sign In</Text>
         </View>
         <Text style={styles.errorLabel}>{this.state.error}</Text>
       </KeyboardAwareScrollView>
     </View>
   );
 }
}

export default (SignUpScreen);
