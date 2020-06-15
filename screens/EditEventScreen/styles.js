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
  editButtonSave: {
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 30,
  }
});
