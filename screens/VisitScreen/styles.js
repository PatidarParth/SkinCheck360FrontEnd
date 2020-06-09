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
    flexDirection: 'column',
    height: '100%',
  },
  notificationView: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  pictureButton: {
    width: '50%'
  },
  textHeader: {
    fontSize: 18,
    fontFamily: 'Arial',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 2,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Arial',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 2
  },
  innerSpacer: {
    paddingTop: 50
  },
  labelFont: {
    color: '#000000',
    fontSize: 16
  },
  inputTimePicker: {
    flex: 1,
    paddingTop: 40,
    borderBottomWidth: 0
  },
  pictureFont: {
    color: 'black',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center', 
  },
  wholeView: {
    flex: 1
  }
});
