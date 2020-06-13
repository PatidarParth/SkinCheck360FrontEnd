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
    fontSize: 13,
    padding: 2
  },
  legalNoticeView: {
    padding: 20
  },
  scrollView: {
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
  },
});
