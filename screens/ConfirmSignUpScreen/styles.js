import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: '30%',
    width: '90%',
  },
  labelFont: {
    color: '#000000',
    fontSize: 12,
    padding: 2,
    fontWeight: 'normal',
    marginBottom: 5,
    fontFamily: 'Avenir-Light',
  },
  logo: {
    width: 60,
    height: 60,
    left: '42.5%',
    alignItems: 'center'
  },
  input: {
    marginBottom: 30,
    marginRight: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0A2B66',
    fontFamily: 'Avenir-Light',
  },
  sectionText: {
    color: '#0A2B66',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontFamily: 'Avenir-Light',
  },
  button: {
    backgroundColor: '#0A2B66',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    marginRight: 1,

  },
  buttonDisabled: {
    backgroundColor: '#808080',
    alignItems: 'center',
    padding: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Avenir-Light'
  },
  footerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10
  },
  sectionFooter: {
    alignItems: 'center',
    backgroundColor: '#0A2B66',
    width: '50%',
  },
  sectionFooterLabel: {
    fontSize: 14,
    color: '#0A2B66',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
    paddingBottom: 10
  },
  errorLabel: {
    fontSize: 14,
    color: '#FF0000',
    alignItems: 'baseline',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  }
});
