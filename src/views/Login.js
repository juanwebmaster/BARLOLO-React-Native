import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';

import LoadingComponent from '../components/LoadingComponent';
import NavHeader from '../components/NavHeader';

import {customerLogin} from '../store/actions/auth';
import {dynamicSize} from '../config';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      showPass: false,
      errors: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('willFocus', ({state, action}) => {
      if (this.props.isLogged && action.type === 'Navigation/BACK') {
        this.props.navigation.goBack();
      }
      this.setState({
        // username: 'dhirajyadav',
        // password: 'pankaj@123',
        username: '',
        password: '',
        showPass: false,
        errors: [],
        isLoading: false,
      });
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  clickSignin = () => {
    const {username, password, errors} = this.state;
    let tmp = [];
    if (!username) {
      tmp = [...errors, 'username'];
    } 
    if (!password) {
      tmp = [...tmp, 'password'];
    } 
    this.setState({errors: tmp});
    if(username && password) {
      this.setState({isLoading: true});
      this.props.customerLogin({username, password})
      .then(() => {
        this.setState({isLoading: false}, () => { 
          const {redirectLink, navigation} = this.props;
          navigation.goBack();
          redirectLink && navigation.navigate(redirectLink);
        });
      })
      .catch(error => {
        this.setState({isLoading: false});
        if(error) {
          this.setState({errors: ['response']});
        }
      })
    }
  }

  clickForgot = () => {
    this.props.navigation.navigate('PasswordReset');
  }

  clickRegister = () => {
    this.props.navigation.goBack();
    this.props.navigation.navigate('Register');
  }

  clear = (value) => {
    const {errors} = this.state;
    const key = Object.keys(errors).find(
      item => errors[item] == value
    )
    errors[key] = '';
    this.setState({errors});
  }

  render() {
    const {navigation} = this.props;
    const {username, password, showPass, errors, isLoading} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Login')}/>
          <KeyboardAvoidingView
            style={styles.contentsView}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
            <ScrollView>
            <Text style={styles.label}>{i18n.t('already_account')}</Text>
            {errors.includes('response') && <Text style={styles.errorslabel}>{i18n.t('Login_Failed_Username_and_Password_doesnt_match')}</Text>}
            <Text style={styles.label}>{i18n.t('username_mobile')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('Type_your_username_or_mobile_number')}
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ username: text.replace(/\s/g, '') }); this.clear('username');}}
                value={username}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('username') && <Text style={styles.errorslabel}>{i18n.t('Username_or_Mobile_number_is_required')}</Text>}
            <Text style={styles.label}>{i18n.t('Password')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('Type_your_password')}
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                secureTextEntry={!showPass}
                onChangeText={(text) => {this.setState({ password: text.replace(/\s/g, '') }); this.clear('password');}}
                value={password}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity style={styles.btnEye} onPress={() => this.setState({showPass: !showPass})}>
                <Icon name={showPass ? 'eye' : 'eye-slash'} size={dynamicSize(14)}/>
              </TouchableOpacity>
            </View>
            {errors.includes('password') && <Text style={styles.errorslabel}>{i18n.t('Password_is_required')}</Text>}
            <TouchableOpacity style={styles.signinBtn} onPress={this.clickSignin}>
              <Icon name='lock' size={dynamicSize(14)}/>
              <Text style={styles.btnLabel}>{i18n.t('Sign In')}</Text>
            </TouchableOpacity>
            <View style={styles.rowStyle}>
              <TouchableOpacity onPress={this.clickForgot}>
                <Text style={styles.fogotbtnLabel}>{i18n.t('forgot_password')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.clickRegister}>
                <Text style={styles.fogotbtnLabel}>{i18n.t('Register')}</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentsView: {
    flex: 1,
    paddingHorizontal: dynamicSize(10),
  },
  label: {
    paddingVertical: dynamicSize(14),
    width: '100%',
    fontSize: dynamicSize(14),
    lineHeight: dynamicSize(22),
    color: Colors.black,
  },
  errorslabel: {
    color: Colors.red,
  },
  inputContainer: {
    paddingHorizontal: dynamicSize(10),
    width: '100%',
    height: dynamicSize(50),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    // backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    fontSize: dynamicSize(13),
    marginHorizontal: dynamicSize(10),
    height: dynamicSize(48),
    color: Colors.black,
  },
  btnEye:{
    position: 'absolute',
    right: dynamicSize(20),
  },
  signinBtn: {
    marginTop: dynamicSize(20),
    width: '100%',
    height: dynamicSize(50),
    borderWidth: 2,
    borderColor: Colors.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  fogotbtnLabel: {
    marginTop: dynamicSize(20),
    fontSize: dynamicSize(14),
    color: Colors.red,
    alignSelf: 'center',
  },
  rowStyle: {
    paddingHorizontal: dynamicSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

const mapStateToProps = ({ loading, auth, user }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  redirectLink: loading.redirectLink,
});

const mapDispatchToProps = {
  customerLogin,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);