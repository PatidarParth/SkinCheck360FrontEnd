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
  notificationView: {
    padding: 10
  },
  labelFont: {
    color: '#7F7D7D',
    fontSize: 14,
    padding: 2
  }
});
