import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalDropdown from 'react-native-modal-dropdown';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  getImageUrl,
  getProfile,
} from '../store/actions/profile';
import UserService from '@app/services/UserService';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';
import ChangePwdModal from '../components/modals/ChangePwdModal';
import ChangeBirthdayModal from '../components/modals/ChangeBirthdayModal';
import PhoneModal from '../components/modals/PhoneModal';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const genderData = ['Male', 'Female'];

class MyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      editable: false,
      user: {},
      avator: '',
      username: '',
      email: '',
      gender: 0,
      birthday: '',
      phone: '',
      newAvator: '',
      ext: '',
      passwordModal: false,
      birthdayModal: false,
      phoneModal: false
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({
        isLoading: true, 
        editable: false,
      });

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.getImageUrl(),
        this.props.getProfile(),
      ]).then(() => {
        const user = this.fetchUserObject();
        const {avator, username, gender, birthday, phone, email} = user;
        this.setState({
          isLoading: false,
          user,
          avator,
          username,
          gender,
          birthday,
          phone,
          email,
          newAvator: '',
          ext: ''
        });

        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        }

      })
      .catch(error => {
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  image() {
    const {userProfile, imageUrl} = this.props;
    let getProfile = _.find(userProfile.custom_attributes, {
      attribute_code: 'profile_image'
    })
    if (getProfile) {
      return `${imageUrl}customer/${getProfile['value']}`
    }
    return 'https://ik.imagekit.io/5ydszqfee/avatar/noimage.png'
  }

  fetchUserObject() {
    const {userProfile} = this.props;
    return {
      avator: this.image(),
      username:
        userProfile.custom_attributes ? userProfile.custom_attributes[1]['value'] : '',
      gender: userProfile.gender ? userProfile.gender : 1,
      birthday: userProfile.dob
        ? moment(userProfile.dob).format('MMM DD YYYY')
        : moment().format('MMM DD YYYY'),
      phone: userProfile.custom_attributes ? userProfile.custom_attributes[0]['value'] : '',
      email: userProfile.email,
    }
  }
  
  uploadLogo = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        let ext = response.fileName.split('.').pop();
        this.setState({newAvator: `data:image/${ext};base64,${response.data}`, ext});
        // this.setState({isLoading: true});
        // UserService.addProfileImage({
        //   customerId: this.props.userId,
        //   image: `data:image/${ext};base64,${response.data}`,
        //   // image: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
        //   ext,
        // })
        //   .then(response => {
        //     // let url = response.data.profile_image.path
        //     this.setState({isLoading: false, avator: response.data.profile_image.path});
        //     alert('Profile image is uploaded successfully!')
        //   })
        //   .catch(error => {
        //     this.setState({isLoading: false});
        //     alert(error.response.data)
        //   })
      }
    });
  }

  setBirthday = (date) => {
    this.setState({birthday: moment(date).format('MMM DD YYYY')});
  }

  updatePhoneNumber = (number) => {
    this.setState({phone: number, phoneModal: false});
  }

  setGender = (index) => {
    this.setState({gender: index});
  }

  update() {
    const {user, avator, username, birthday, gender, email, phone, newAvator, ext} = this.state;
    const {userId, userProfile} = this.props;
    this.setState({isLoading: true});

    let profile = {
      customer: {
        id: userId,
        dob: birthday,
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        gender: gender,
        email: email ? email : user.email,
        website_id: userProfile.website_id,
        custom_attributes: [
          {
            attribute_code: 'username',
            value: username ? username : user.username
          },
          {
            attribute_code: 'mobile_number',
            value: phone
          },
          {
            attribute_code: 'profile_image',
            value: avator.split('/').slice(-1).pop()
          }
        ]
      }
    }

    UserService.updateProfile(profile)
      .then(response => {
        this.setState({editable: false, isLoading: false});
      })
      .catch(error => {
        console.log(error)
        this.setState({isLoading: false});
      })

    if(newAvator) {
      UserService.addProfileImage({
        customerId: userId,
        image: newAvator,
        ext,
      })
        .then(response => {
          alert('Profile image is uploaded successfully!')
        })
        .catch(error => {
          alert(error.response.data)
        })
    }
  }

  clickButton = () => {
    const {editable} = this.state;
    if(editable) {
      this.update();
    } else {
      this.setState({editable: true});
    }
  }

  render() {
    const {navigation} = this.props;
    const {
      isLoading,
      user,
      avator,
      username,
      birthday,
      gender,
      email,
      phone,
      editable,
      passwordModal,
      birthdayModal,
      phoneModal,
      newAvator,
    } = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('My Profile')} />
          <KeyboardAvoidingView
            style={styles.contentsView}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
            <ScrollView>
              <View style={styles.bannerView}>
                <Image style={styles.bannerImg} source={require('../assets/img/slider/category-slider.jpg')}/>
                <View style={styles.avatarView}>
                  <Image style={styles.bannerImg} source={{uri: newAvator ? newAvator : avator}}/>
                  {editable &&
                  <TouchableOpacity onPress={this.uploadLogo}>
                    <Icon name='edit' size={dynamicSize(14)} />
                  </TouchableOpacity>}
                </View>
              </View>
              <View style={styles.infoBody}>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('User Name')}</Text>
                  <TextInput
                    style={styles.textInput}
                    editable={editable}
                    placeholder={user.username}
                    // placeholderTextColor='#212529'
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(text) => {this.setState({ username: text.replace(/\s/g, '') });}}
                    value={username}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('Password')}</Text>
                  {!editable ?
                    <Text style={styles.label}>{'************'}</Text> :
                    <TouchableOpacity onPress={() => this.setState({passwordModal: true})}>
                      <Text style={styles.label}>Change</Text>
                    </TouchableOpacity>
                  }
                </View>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('Birthday')}</Text>
                  {!editable ?
                    <Text style={styles.label}>{birthday}</Text> :
                    <TouchableOpacity style={styles.rightTap} onPress={() => this.setState({birthdayModal: true})}>
                      <Text style={styles.label}>{birthday}  </Text>
                      <Icon name='angle-right' size={dynamicSize(13)} />
                    </TouchableOpacity>
                  }
                </View>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('Gender')}</Text>
                  {!editable ?
                    <Text style={styles.label}>{gender == 1 ? 'Male' : gender == 2 ? 'Female' : ''}</Text> :
                    <View style={styles.gender}>
                      <ModalDropdown
                        style={{flex: 1}}
                        textStyle={styles.label}
                        dropdownStyle={{paddingHorizontal: dynamicSize(10), height: 80}}
                        defaultIndex={0}
                        defaultValue={'Male'}
                        options={genderData}
                        onSelect={(index) => this.setGender(parseInt(index)+1)}	
                      />
                      <Icon style={{position: 'absolute', right: 0}} name='caret-down' color='#212529' size={dynamicSize(13)} />
                    </View>
                  }
                </View>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('Email')}</Text>
                  <TextInput
                    style={styles.textInput}
                    editable={editable}
                    placeholder={user.email}
                    // placeholderTextColor='#212529'
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(text) => {this.setState({ email: text.replace(/\s/g, '') });}}
                    value={email}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.rowStyle}>
                  <Text style={styles.label}>{i18n.t('Phone')}</Text>
                  {!editable ?
                    <Text style={styles.label}>{phone}</Text> :
                    <TouchableOpacity onPress={() => this.setState({phoneModal: true})}>
                      <Text style={styles.verifyTxt}>{i18n.t('Verify')}</Text>
                      <View style={styles.rightTap}>
                        <Text style={styles.label}>{phone}  </Text>
                        <Icon name='angle-right' size={dynamicSize(13)} />
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={this.clickButton}>
              {!editable ?
              <Text style={styles.bntLabel}>{i18n.t('Edit')}</Text> :
              <Text style={styles.bntLabel}>{i18n.t('Save')}</Text>}
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <ChangePwdModal visible={passwordModal} onExit={() => this.setState({passwordModal: false})}/>
          <ChangeBirthdayModal
            visible={birthdayModal}
            date={moment(birthday).toDate()}
            setDate={this.setBirthday}
            onExit={() => {
              this.setState({birthdayModal: false});
            }}
          />
          <PhoneModal
            visible={phoneModal}
            updatePhoneNumber={this.updatePhoneNumber}
            onExit={() => {
              this.setState({phoneModal: false});
            }}
          />
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
  },
  bannerView: {
    width: '100%',
    height: dynamicSize(140),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImg: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  avatarView: {
    width: dynamicSize(80),
    height: dynamicSize(80),
    borderRadius: dynamicSize(40),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBody: {
    flex: 1,
    paddingTop: dynamicSize(15),
    paddingHorizontal: dynamicSize(15),
  },
  rowStyle: {
    paddingHorizontal: dynamicSize(15),
    height: dynamicSize(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: dynamicSize(13),
    color: '#212529',
  },
  textInput: {
    height: dynamicSize(48),
    fontSize: dynamicSize(13),
    color: '#212529',
  },
  button: {
    bottom: 0,
    paddingVertical: dynamicSize(15),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bntLabel: {
    fontSize: dynamicSize(13),
    fontWeight: 'bold',
    color: 'white',
  },
  rightTap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyTxt: {
    position: 'absolute',
    top: -dynamicSize(14),
    fontSize: dynamicSize(11),
    color: Colors.red,
    alignSelf: 'flex-end',
  },
  gender: {
    width: dynamicSize(66),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

const mapStateToProps = ({ auth, user, profile }) => ({
  lang: user.lang,
  isLogged: auth.isLogged,
  userId: auth.user.id,
  userProfile: profile.userProfile,
  imageUrl: profile.imageUrl,
  mobileCheck: profile.mobileCheck,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  getImageUrl,
  getProfile,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyProfile);