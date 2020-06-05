import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  eventView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'space-around'
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
  }
});
