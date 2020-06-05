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
  color: '#fff'
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
    fontSize: 20,
    paddingTop: 20
  },
  textHeader: {
    fontSize: 20,
    fontFamily: 'Arial',
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
    fontSize: 16
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 10
  },
  secondaryTest: {
    color: '#000000',
    fontSize: 16
  },
  text: {
    fontSize: 12,
    display: 'flex',
    fontFamily: 'Arial',
  },
  flexGrow: {
    flex: 1,
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
    paddingTop: 5,
  },
  inputSpacer: {
    paddingTop: 50,
    paddingBottom: 10
  },
  photoButtonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
  },
  photoButton: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    padding: 10,
    width: '40%'
  }
});
