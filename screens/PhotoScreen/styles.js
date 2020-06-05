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
    alignItems: 'center'
  },
  pictureButton: {
    width: '50%'
  }
});
