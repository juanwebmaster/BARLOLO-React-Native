import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import UserService from '../../services/UserService';

import LoadingComponent from '../../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../../config';

export default class ChangePwdModal extends React.Component {
  state = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    errors: [],
    isLoading: false,
  }

  clear = (value) => {
    const {errors} = this.state;
    const key = Object.keys(errors).find(
      item => errors[item] == value
    )
    errors[key] = '';
    this.setState({errors});
  }

  onExit = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: [],
      isLoading: false,
    });
    this.props.onExit();
  }

  changePassword = () => {
    const {currentPassword, newPassword, confirmPassword} = this.state;
    let errors = [];
    if (currentPassword && newPassword) {
      if (newPassword == confirmPassword) {
        this.setState({isLoading: true});
        UserService.changePassword({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
          .then(response => {
            alert('Your password is updated successfully!')
            this.onExit();
          })
          .catch(error => {
            alert(error.response.data.message)
            this.setState({isLoading: false});
          })
      } else {
        errors = [...errors, 'confirmPassword']
      }
    } else {
      if (!currentPassword) {
        errors = [...errors, 'currentPassword']
      }
      if (!newPassword) {
        errors = [...errors, 'newPassword']
      }
    }
    this.setState({errors});
  }

  render() {
    const {currentPassword, newPassword, confirmPassword, errors, isLoading} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
      }}>
        <View style={styles.container}>
          <View style={styles.body}>
            <View style={styles.header}>
              <Text style={styles.title}>{i18n.t('Change Password')}</Text>
              <TouchableOpacity onPress={this.onExit}>
                <FontAwesomeIcon name='close' size={dynamicSize(20)} color='white'/>
              </TouchableOpacity>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.label}>{i18n.t('Current Password')}:<Text style={styles.requerSymbol}> *</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={''}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(text) => {this.setState({ currentPassword: text.replace(/\s/g, '') }); this.clear('currentPassword');}}
                  value={currentPassword}
                  underlineColorAndroid="transparent"
                />
              </View>
              {errors.includes('currentPassword') && <Text style={styles.errorslabel}>{'Current Password is required.'}</Text>}
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.label}>{i18n.t('New Password')}:<Text style={styles.requerSymbol}> *</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={''}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(text) => {this.setState({ newPassword: text.replace(/\s/g, '') }); this.clear('newPassword');}}
                  value={newPassword}
                  underlineColorAndroid="transparent"
                />
              </View>
              {errors.includes('newPassword') && <Text style={styles.errorslabel}>{'New Password is required.'}</Text>}
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.label}>{i18n.t('Confirm Password')}:<Text style={styles.requerSymbol}> *</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={''}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(text) => {this.setState({ confirmPassword: text.replace(/\s/g, '') }); this.clear('confirmPassword');}}
                  value={confirmPassword}
                  underlineColorAndroid="transparent"
                />
              </View>
              {errors.includes('confirmPassword') && <Text style={styles.errorslabel}>{'Password is not matched with confirm password.'}</Text>}
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={this.changePassword}>
                <Text style={styles.btnlabel}>{i18n.t('Update')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <LoadingComponent visible={isLoading}/>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#000000A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: dynamicSize(12),
    paddingHorizontal: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.red,
  },
  title: {
    fontSize: dynamicSize(16),
    color: 'white',
  },
  rowStyle: {
    paddingTop: dynamicSize(12),
    paddingHorizontal: dynamicSize(10),
  },
  label: {
    width: '100%',
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  errorslabel: {
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  requerSymbol: {
    color: Colors.red
  },
  inputContainer: {
    width: '100%',
    height: dynamicSize(50),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textInput: {
    flex: 1,
    fontSize: dynamicSize(13),
    marginHorizontal: dynamicSize(10),
    height: dynamicSize(48),
    color: Colors.black,
  },
  footer: {
    marginTop: dynamicSize(20),
    padding: dynamicSize(12),
    borderTopWidth: 1,
    borderColor: '#E2E2E2AD',
  },
  button: {
    backgroundColor: Colors.red,
    padding: dynamicSize(10),
    alignSelf: 'flex-end',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'red',
  },
  btnlabel: {
    color: 'white',
    fontSize: dynamicSize(16),
  }
});
