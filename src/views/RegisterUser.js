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
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {dynamicSize} from '../config';

import LoadingComponent from '../components/LoadingComponent';
import NavHeader from '../components/NavHeader';

import {customerRegister, customerLogin} from '../store/actions/auth';

import UserService from '@app/services/UserService';
import { ScrollView } from 'react-native-gesture-handler';

class RegisterUser extends React.Component {
  constructor() {
    super();
    this.state = {
      fullname: null,
      username: null,
      password: null,
      confirm: null,
      email: null,
      showPass: false,
      showConf: false,
      errors: [],
      apiError: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        fullname: null,
        username: null,
        password: null,
        confirm: null,
        email: null,
        showPass: false,
        showConf: false,
        errors: [],
        apiError: '',
        isLoading: false,
      });
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  handleProcess() {
    const {fullname, username, password, email} = this.state;
    const body = {
      data: {
        type: 'BUYER',
        firstname: fullname,
        lastname: '',
        mobile_number: this.props.mobile,
        email: email || this.props.mobile + '@barlolo.com',
        password: password,
        store_id: (this.props.lang  == 'mm')? 3 : 1,
        username: username
      }
    }
    this.props.customerRegister(body)
      .then(response => {
        if (response.data.hasOwnProperty('error')) {
          alert(response.data.msg);
          this.setState({isLoading: false});
        } else {
          this.props.customerLogin({
            username,
            password,
          })
          .then(() => {
            this.setState({isLoading: false});
            const {redirectLink, navigation} = this.props;
            navigation.goBack();
            redirectLink && navigation.navigate(redirectLink);
          })
        }
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error)
        /* this.apiError = error.response.data.message */
        this.apiError = error.response
      })
  };

  handleRegister() {
    this.setState({isLoading: true});

    if (this.state.username) {
      UserService.checkValidate(this.state.username)
        .then(response => {
          let objectKeys = Object.keys(response.data)

          if (objectKeys[0] == 'success') {
            this.handleProcess()
          } else {
            this.setState({isLoading: false});
            alert('This Username is already in use')
          }
        })
        .catch(error => {
          this.apiError = error.response
          this.setState({isLoading: false});
          console.log(error.response)
        })
    }
  };

  clickRegister = () => {
    const {fullname, username, password, confirm, email, errors} = this.state;
    let tmp = [];
    if (!fullname) {
      tmp = [...errors, 'fullname'];
    } 
    if (!username) {
      tmp = [...tmp, 'username'];
    } 
    if (!password) {
      tmp = [...tmp, 'password'];
    } 
    if (!confirm) {
      tmp = [...tmp, 'confirm'];
    } 
    if (password && confirm && password != confirm) {
      tmp = [...tmp, 'notmatch'];
    }
    this.setState({errors: tmp});
    if(fullname && username && password && confirm && password == confirm) {
      this.handleRegister();
    }
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
    const {fullname, username, password, confirm, email, showPass, showConf, errors, apiError, isLoading} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Register')}/>
          <KeyboardAvoidingView
            style={styles.contentsView}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
            <ScrollView>
            {errors.includes('response') && <Text style={styles.errorslabel}>Register Failed!</Text>}
            {apiError !== '' && <Text style={styles.errorslabel}>{apiError}</Text>}
            <Text style={styles.label}>{i18n.t('Full Name')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your full name"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ fullname: text }); this.clear('fullname');}}
                value={fullname}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('fullname') && <Text style={styles.errorslabel}>Full Name is required!</Text>}
            <Text style={styles.label}>{i18n.t('User Name')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your username"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ username: text.replace(/\s/g, '') }); this.clear('username');}}
                value={username}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('username') && <Text style={styles.errorslabel}>User Name is required!</Text>}
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
            {errors.includes('notmatch') && <Text style={styles.errorslabel}>Password is not matched with confirm password!</Text>}
            {errors.includes('password') && <Text style={styles.errorslabel}>{i18n.t('Password_is_required')}</Text>}
            <Text style={styles.label}>{i18n.t('Confirm Password')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your confirm password"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                secureTextEntry={!showConf}
                onChangeText={(text) => {this.setState({ confirm: text.replace(/\s/g, '') }); this.clear('confirm');}}
                value={confirm}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity style={styles.btnEye} onPress={() => this.setState({showConf: !showConf})}>
                <Icon name={showConf ? 'eye' : 'eye-slash'} size={dynamicSize(14)}/>
              </TouchableOpacity>
            </View>
            {errors.includes('confirm') && <Text style={styles.errorslabel}>Confirm password is required!</Text>}
            <Text style={styles.label}>{i18n.t('email_optional')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your email"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ email: text.replace(/\s/g, '') }); this.clear('email');}}
                value={email}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('email') && <Text style={styles.errorslabel}>Email is required!</Text>}
            <TouchableOpacity style={styles.signinBtn} onPress={this.clickRegister}>
              {/* <Icon name='lock' size={dynamicSize(14)}/> */}
              <Text style={styles.btnLabel}>{i18n.t('Create an Account')}</Text>
            </TouchableOpacity>
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
    paddingHorizontal: '5%',
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
    borderColor: 'gray',
    // backgroundColor: Colors.white,
  },
  textInput: {
    marginLeft: dynamicSize(10),
    width: '90%',
    height: dynamicSize(48),
    fontSize: dynamicSize(13),
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
  }
});

const mapStateToProps = ({ auth, user, loading }) => ({
  isLogged: auth.isLogged,
  mobile: auth.mobile,
  lang: user.lang,
  redirectLink: loading.redirectLink,
});

const mapDispatchToProps = {
  customerRegister,
  customerLogin,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterUser);