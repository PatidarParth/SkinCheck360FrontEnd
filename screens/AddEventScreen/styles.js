import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  providerView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  notificationView: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonTimePicker: {
    height: 50
  },
  inputTimePicker: {
    flex: 1,
    paddingTop: 40
  },
  innerSpacer: {
    paddingTop: 50
  },
  labelFont: {
    color: '#000000',
    fontSize: 16
  },
  errorFont: {
    color: 'red',
    fontSize: 16,
    paddingLeft: 30,
    paddingTop: 1
  },
  pictureFont: {
    color: 'black',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }
});
