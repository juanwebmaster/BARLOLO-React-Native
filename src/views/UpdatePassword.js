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
import {dynamicSize} from '../config';

import LoadingComponent from '../components/LoadingComponent';
import NavHeader from '../components/NavHeader';

import {customerLogin} from '../store/actions/auth';

import UserService from '@app/services/UserService';

class UpdatePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      password: null,
      confirm: null,
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
        password: null,
        confirm: null,
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

  clickUpdate = () => {
    const {password, confirm, errors} = this.state;
    let tmp = [];
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
    if( password && confirm && password == confirm ) {
      this.setState({isLoading: true});
      const {entity_id, mobile, username} = this.props.user;
      UserService.updatePassword(entity_id, password, mobile)
        .then(response => {
          this.props.customerLogin({
            username: username,
            password: password
          })
          .then(() => {
            this.setState({isLoading: false});
            alert('Your password updated successfully!')
            const {redirectLink, navigation} = this.props;
            navigation.goBack();
            redirectLink && navigation.navigate(redirectLink);
          })
        })
        .catch(error => {
          this.setState({isLoading: false, errors: ['response'], apiError: error.response.data.message});
          console.log(error)
        })
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
    const {navigation, user} = this.props;
    const {password, confirm, showPass, showConf, errors, apiError, isLoading} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} isBack={false} title={'Barlolo.com'}/>
          <KeyboardAvoidingView
            style={styles.contentsView}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
            <ScrollView>
            {errors.includes('response') && <Text style={styles.errorslabel}>Set Password Failed!</Text>}
            {apiError !== '' && <Text style={styles.errorslabel}>{apiError}</Text>}
            <Text style={styles.label}>{i18n.t('User Name')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder=""
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={false}
                // onChangeText={(text) => {this.setState({ username: text.replace(/\s/g, '') }); this.clear('username');}}
                value={user.username}
                underlineColorAndroid="transparent"
              />
            </View>
            <Text style={styles.label}>{i18n.t('New Password')}</Text>
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
            <Text style={styles.label}>{i18n.t('Confirm New Password')}</Text>
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
            <TouchableOpacity style={styles.verifyBtn} onPress={this.clickUpdate}>
              {/* <Icon name='lock' size={dynamicSize(14)}/> */}
              <Text style={styles.btnLabel}>{i18n.t('Set a New Password')}</Text>
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
  verifyBtn: {
    marginTop: dynamicSize(22),
    width: '100%',
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(14),
    fontWeight: 'bold',
    color: Colors.white,
  },
  fogotbtnLabel: {
    marginTop: dynamicSize(20),
    fontSize: dynamicSize(14),
    color: Colors.red,
    alignSelf: 'center',
  }
});

const mapStateToProps = ({ user, loading }) => ({
  user: user.user,
  lang: user.lang,
  redirectLink: loading.redirectLink,
});

const mapDispatchToProps = {
  customerLogin,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdatePassword);