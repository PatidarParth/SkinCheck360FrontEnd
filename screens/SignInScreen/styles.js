import { StyleSheet } from 'react-native';
import baseStyles from '../../styles';

export default StyleSheet.create({
  ...baseStyles,
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: '10%',
    width: '90%'
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
    width: 80,
    height: 90,
    left: '39%',
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
    marginBottom: 20,
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
    width: '85%'
  },
  disableButton: {
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    marginRight: 10,
    width: '85%'
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
  signInButtonView: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    paddingBottom: 5
  },
  errorLabel: {
    fontSize: 14,
    color: '#FF0000',
    alignItems: 'baseline',
    textAlign: 'center',
    fontFamily: 'Avenir-Light'
  },
  termsLabel: {
    fontSize: 14,
    color: '#696969',
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
  },
});
