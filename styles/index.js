import { StyleSheet } from 'react-native';

const baseContainerStyles = {
  flex: 1,
};

const headerContainerStyle = {
  backgroundColor: '#0A2B66',
  justifyContent: 'space-around'
};

const headerCenterComponentStyle = {
  fontSize: 20,
  color: '#fff',
  fontFamily: 'Avenir-Light'
};

export default StyleSheet.create({
  container: {
    ...baseContainerStyles
  },
  header: {
    ...headerContainerStyle
  },
  headerCenter: {
    ...headerCenterComponentStyle
  },
  notificationText: {
    fontSize: 18,
    fontFamily: 'Avenir-Light',
    paddingTop: 20
  },
  textHeader: {
    fontSize: 20,
    fontFamily: 'Avenir-Light',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    padding: 10
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Avenir-Light'
  },
  text: {
    fontSize: 12,
    display: 'flex',
    fontFamily: 'Avenir-Light',
  },
  flexGrow: {
    flex: 1,
    fontFamily: 'Avenir-Light'
  },
  inputIcon: {
    paddingRight: 10
  },
  leftHeaderComponent: {
    left: -20
  },
  rightHeaderComponent: {
    right: -20
  },
  buttonSave: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  inputSpacer: {
    padding: 10
  },
  innerSpacer: {
    paddingTop: 50
  },
  photoButtonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
  photoButton: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    padding: 8,
    width: '45%'
  },
  labelFont: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Avenir-Light',
    fontWeight: '700'
  },
  inputTimePicker: {
    flex: 1,
    paddingTop: 40
  },
  pictureFont: {
    color: 'black',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  },
  pictureButton: {
    width: '50%'
  }
});
