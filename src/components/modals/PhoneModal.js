import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MobileModal from 'react-native-modal';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../../config';

import LoadingComponent from '../LoadingComponent';

import {getUserInfo} from '@app/store/actions/user';

class PhoneModal extends React.Component {
  constructor() {
    super();
    this.state = {
      countryList: ['+95', '+91'],
      countryCode: '+95',
      visibleCountryList: false,
      mobile_number: null,
      verificationCode: null,
      errorMsg: '',
      register: true,
      isloading: false,
      registeredModalShown: false,
    };
  }

  handleSendCode  = () => {
    const {countryCode, mobile_number} = this.state;
    if(!mobile_number) {
      this.setState({errorMsg: 'mobile'});
    } else {
      this.setState({isloading: true});
      this.props.getUserInfo({customermobile: this.state.mobile_number})
      .then(() => {
        if (this.props.user.error == 1 && this.props.user.msg) {
          firebase
            .auth()
            .signInWithPhoneNumber(countryCode + mobile_number)
            .then(confirmResult => {
              this.setState({ confirmResult, register: false, isloading: false })
            })
            .catch(error => {
              this.setState({isloading: false});
              alert(error.message)
              console.log(error)
            })
        } 
        if(this.props.user.mobile) {
          this.setState({
            isloading: false,
            registeredModalShown: true,
          });              
        }
      })
      .catch(error => {
        this.setState({isloading: false});
        alert(error.message)
        console.log(error)
      })
    }
  }

  handleVerifyCode = () => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode && verificationCode.length == 6) {
      this.setState({isloading: true});
      confirmResult
        .confirm(verificationCode)
        .then(result => {
          this.setState({
            countryCode: '+95',
            visibleCountryList: false,
            mobile_number: null,
            verificationCode: null,
            errorMsg: '',
            register: true,
            isloading: false,
          });
          this.props.updatePhoneNumber(this.state.mobile_number);
        })
        .catch(error => {
          this.setState({isloading: false});
          alert(error.message)
          console.log(error)
        })
    } else {
      this.setState({errorMsg: 'code'});
    }
  }

  onExit = () => {
    this.setState({
      countryCode: '+95',
      visibleCountryList: false,
      mobile_number: null,
      verificationCode: null,
      errorMsg: '',
      register: true,
      isloading: false,
    });
    this.props.onExit();
  }

  render() {
    const {visible} = this.props;
    const {
      countryList, 
      countryCode, 
      visibleCountryList, 
      mobile_number, 
      verificationCode, 
      errorMsg, 
      register, 
      isloading, 
      registeredModalShown
    } = this.state;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
      }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('Change Mobile Number')}</Text>
            <TouchableOpacity onPress={this.onExit}>
              <FontAwesomeIcon name='close' size={dynamicSize(20)} color='white'/>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {register ? <View style={styles.contentsView}>
              <Text style={styles.label}>{i18n.t('enter_phone_number')}: <Text style={{color: Colors.red}}>*</Text></Text>
              <View style={styles.numberView}>
                <TouchableOpacity style={styles.countryCode} onPress={() => this.setState({visibleCountryList: !visibleCountryList})}>
                  <Text style={styles.countryCodeTxt}>{countryCode}</Text>
                  <Icon name='caret-down' size={dynamicSize(20)} color={Colors.red} />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={i18n.t('enter_phone_number')}
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="none"
                    keyboardType={'numeric'}
                    onChangeText={(text) => this.setState({ mobile_number: text.replace(/[^0-9]/g, ''), errorMsg: '' })}
                    value={mobile_number}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              {errorMsg == 'mobile' && <Text style={styles.errorslabel}>{i18n.t('Mobile Number is required')}</Text>}
              <Text style={styles.contentText}>{i18n.t('An SMS or text confirmation may be sent to verify your number')}</Text>
              <TouchableOpacity style={styles.verifyBtn} onPress={this.handleSendCode}>
                <Text style={styles.btnLabel}>{i18n.t('sms')}</Text>
              </TouchableOpacity>
              {visibleCountryList && <View style={styles.countryList}>
                  {countryList.map((item, index) => 
                  <TouchableOpacity
                    key={index}
                    style={[styles.countryListItem, item === countryCode && {backgroundColor: 'blue'}]}
                    onPress={() => this.setState({visibleCountryList: false, countryCode: item})}
                  >
                    <Text style={[styles.countryCodeTxt, item === countryCode && {color: 'white'}]}>{item}</Text>
                  </TouchableOpacity>)
                  }
                </View>}
            </View> : 
            <View style={styles.contentsView}>
              <Text style={styles.label}>{i18n.t('varify_phone')}: <Text style={{color: Colors.red}}>*</Text></Text>
              <View style={styles.inputContainer2}>
                <TextInput
                  style={[styles.textInput, {textAlign: 'center'}]}
                  placeholder={'Enter Code'}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  onChangeText={(text) => this.setState({ verificationCode: text.replace(/[^0-9]/g, ''), errorMsg: '' })}
                  value={verificationCode}
                  underlineColorAndroid="transparent"
                />
              </View>
              {errorMsg == 'code' && <Text style={styles.errorslabel}>{'Please enter a 6 digit OTP code.'}</Text>}
              <TouchableOpacity style={[styles.verifyBtn, {marginTop: 25}]} onPress={this.handleVerifyCode}>
                <Text style={styles.btnLabel}>{i18n.t('continue')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({register: true})}>
                <Text style={styles.contentText}>{i18n.t('I didnt get a code')}</Text>
              </TouchableOpacity>
            </View>}
          </View>
          <LoadingComponent visible={isloading}/>
          <MobileModal
            isVisible={registeredModalShown}
            onBackButtonPress={() => this.setState({ registeredModalShown: false })}
            onBackdropPress={() => this.setState({ registeredModalShown: false })}
            style={styles.registeredModalContainer}
          >
            <View style={styles.registeredModalContent}>
              <SimpleLineIcon name="close" color={Colors.red} size={dynamicSize(60)} />
              <Text style={styles.registeredModalContentText}>This mobile number already register</Text>
              <TouchableOpacity 
                style={styles.registeredModalOKButtonWrapper}
                onPress={() => this.setState({ registeredModalShown: false })}
              >
                <View style={styles.registeredModalOKButton}>
                  <Text style={styles.registeredModalOKButtonText}>OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </MobileModal>
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
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
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
  body: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  contentsView: {
    flex: 1,
  },
  label: {
    paddingVertical: dynamicSize(14),
    width: '100%',
    fontSize: dynamicSize(14),
    lineHeight: dynamicSize(22),
    textAlign: 'center',
    color: Colors.black,
  },
  numberView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  countryCode: {
    paddingHorizontal: dynamicSize(10),
    width: '21%',
    height: dynamicSize(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.red,
  },
  countryCodeTxt: {
    fontSize: dynamicSize(16),
    fontWeight: 'bold',
    color: Colors.red,
  },
  countryList: {
    position: 'absolute',
    left: 0,
    top: dynamicSize(98),
    width: '21%',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.borderColor,
  },
  countryListItem: {
    paddingHorizontal: dynamicSize(12),
    width: '100%',
    height: dynamicSize(40),
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  inputContainer: {
    width: '75%',
    height: dynamicSize(50),
    borderWidth: 2,
    borderColor: Colors.red,
  },
  textInput: {
    marginLeft: dynamicSize(10),
    width: '90%',
    height: dynamicSize(48),
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  errorslabel: {
    marginTop: dynamicSize(5),
    marginLeft: '28%',
    color: Colors.red,
  },
  contentText: {
    paddingVertical: dynamicSize(25),
    width: '100%',
    fontSize: dynamicSize(14),
    lineHeight: dynamicSize(22),
    textAlign: 'center',
    color: Colors.gray,
    opacity: 0.9,
  },
  verifyBtn: {
    marginTop: dynamicSize(5),
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
  inputContainer2: {
    width: '50%',
    height: dynamicSize(50),
    borderWidth: 2,
    borderRadius: 8,
    alignSelf: 'center',
    borderColor: Colors.red,
  },
  registeredModalContainer: {
    alignItems: 'center',
  },
  registeredModalContent: {
    backgroundColor: Colors.white,
    width: SCREEN_WIDTH * 0.9,
		borderRadius: dynamicSize(6),
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: dynamicSize(30),
    paddingBottom: dynamicSize(20),
  },
  registeredModalContentText: {
    color: Colors.black,
    fontSize: dynamicSize(18),
    paddingVertical: dynamicSize(15),
  },
  registeredModalOKButtonWrapper: {
    padding: dynamicSize(2),
    backgroundColor: 'transparent',
    borderColor: '#333333',
    borderWidth: dynamicSize(1),
    borderRadius: dynamicSize(8),
  },
  registeredModalOKButton: {
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(35),
    backgroundColor: '#3085d6',
    borderRadius: dynamicSize(6),
  },
  registeredModalOKButtonText: {
    color: Colors.white,
    fontSize: dynamicSize(18),
  }
});

const mapStateToProps = ({ auth, user }) => ({
  isLogged: auth.isLogged,
  user: user.user,
  lang: user.lang,
});

const mapDispatchToProps = {
  getUserInfo,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneModal);