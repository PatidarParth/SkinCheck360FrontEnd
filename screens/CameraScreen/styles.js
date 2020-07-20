import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  containerNoPhoto: {
    backgroundColor: '#0A2B66',
    justifyContent: 'space-around'
  },
  container: {
    flex: 1,
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '50%',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    height: '50%',
    borderTopWidth: 4,
    borderTopColor: '#E44262',
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
    fontFamily: 'Avenir-Light'
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1
  },
  maskInner: {
    width: '100%',
    backgroundColor: 'transparent'
  },
  maskFrame: {
    backgroundColor: '#000000',
    opacity: 0.7
  },
  maskRow: {
    width: '100%'
  },
  maskCenter: { flexDirection: 'row' },
  rectangleText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    textAlign: 'center',
    color: 'white'
  },
  backButton: {
    left: -20,
    top: 20
  }
});
