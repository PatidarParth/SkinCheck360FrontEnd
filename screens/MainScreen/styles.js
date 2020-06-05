import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  innerCameraPermissionsView: {
    display: 'flex',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  outerCameraPermissionsView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 40
  },
  scrollView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  loadingView: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  visitOuterView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  visitInnerView: {
    flex: 1,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  swipeView: {
    display: 'flex',
    flex: 0,
    backgroundColor: '#0A2B66'
  },
  leftSwipe: {
    display: 'flex',
    width: 75,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  leftSwipeIcon: {
    paddingRight: 30
  },
  rightSwipe: {
    display: 'flex',
    width: 75,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  rightSwipeView: {
    display: 'flex',
    backgroundColor: '#0A2B66',
    flex: 0
  },
  privacyNoticeView: {
    padding: 20
  }
});
