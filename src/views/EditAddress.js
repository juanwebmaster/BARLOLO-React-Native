import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';

import {updateIsForced, checkAuth, fetchAdminToken} from '../store/actions/auth';
import {fetchLocation, clearLocation} from '../store/actions/location';
import {setRedirectLink} from '../store/actions/loading';

import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import UserService from '@app/services/UserService.js'

class EditAddress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      errors: [],
      address_id: '',
      username: '',
      counrtyCode: '+95',
      telephone: '',
      street: '',
      region_id: '',
      city_id: '',
      township: '',
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      const {routeName, params} = state;
      const {address} = params;
      this.setState({
        isLoading: true,
        errors: [],
        address_id: address.id,
        username: address.firstname + ' ' + address.lastname,
        counrtyCode: '+95',
        telephone: address.telephone,
        street: address.street[0],
        region_id: address.region_id,
        city_id: '',
        township: address.custom_attributes[0].value,
      });

      Promise.all([
        this.props.clearLocation(),
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.fetchLocation({
          countryCode: 'MM',
          regionId: address.region_id,
          cityId: 0
        }),
      ]).then(() => {
        this.setState({isLoading: false});

        if (params && params.requiresAuth && !this.props.isLogged) {
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        }

        this.props.location.region.map((item, index) => {
          if(item.id == address.region_id) this.selecter1.select(index);
        })
        let city_id = 0;
        this.props.location.city.map((item, index) => {
          if(item.value == address.city) {
            this.selecter2.select(index);
            city_id = item.id;
          }
        })

        this.setState({isLoading: true, city_id});

        this.props.fetchLocation({
          countryCode: 'MM',
          regionId: address.region_id,
          cityId: city_id,
        }).then(() => {
          this.props.location.township.map((item, index) => {
            if(item.value == address.custom_attributes[0].value) {
              this.selecter3.select(index);
            }
          })  
          this.setState({isLoading: false});
        })
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

  getIndex = (data, ) => {

  }

  clear = (value) => {
    const {errors} = this.state;
    const key = Object.keys(errors).find(
      item => errors[item] == value
    )
    errors[key] = '';
    this.setState({errors});
  }

  onClickExit = () => {
    this.props.navigation.goBack();
  }

  fetchLocation(regionId, cityId) {
    const {errors} = this.state;
    if (errors.includes('region_id')) {
      this.clear('region_id');
    }

    if (errors.includes('city_id')) {
      this.clear('city_id');
    }

    if (errors.includes('township')) {
      this.clear('township');
    }

    this.setState({isLoading: true});

    return this.props.fetchLocation({
        countryCode: 'MM',
        regionId: regionId,
        cityId: cityId
      })
      .then(() => {
        this.setState({isLoading: false});
      })
  }

  getValues = (data) => {
    const values = data.map(item => item.value)
    return values;
  }

  onSelectCode = (index) => {

  }
  
  onSelectState = (index) => {
    const {location} = this.props;
    const region_id = location.region[index].id;
    this.setState({region_id, city_id: '', township: ''});
    this.selecter2.select(-1);
    this.selecter3.select(-1);
    this.fetchLocation(region_id, 0);
  }
  
  onSelectRegion = (index) => {
    const {location} = this.props;
    const city_id = location.city[index].id;
    this.setState({city_id, township: ''});
    this.selecter3.select(-1);
    this.fetchLocation(this.state.region_id, city_id);
  }
  
  onSelectTown = (index) => {
    const {errors} = this.state;
    if (errors.includes('township')) {
      this.clear('township');
    }
    const {location} = this.props;
    const township = location.township[index].value;
    this.setState({township});
  }

  onClickSave = () => {
    let errors = [];
    const {address_id, username, telephone, region_id, city_id, township, street} = this.state;
    if(!username) {
      errors=['username'];
    }
    if(!telephone) {
      errors=[...errors, 'telephone'];
    }
    if(!region_id) {
      errors=[...errors, 'region_id'];
    }
    if(!city_id) {
      errors=[...errors, 'city_id'];
    }
    if(!township) {
      errors=[...errors, 'township'];
    }
    if(!street) {
      errors=[...errors, 'street'];
    }
    this.setState({errors});
    if(errors.length === 0) {
      let name = username.split(' ')
      let address = {
        customer_id: this.props.user.id,
        email: this.props.user.email,
        address: {
          address_id,
          firstname: name[0],
          lastname: name.splice(1).join(' '),
          street: street,
          city: this.props.location.city
            ? this.props.location.city.find(
                city => city.id == city_id
              ).value
            : '',
          country_id: 'MM',
          region: region_id,
          region_id: region_id,
          telephone: telephone,
          default_billing: 1,
          default_shipping: 1,
          township: township,
          save_other_data: 1
        }
      }
      this.setState({isLoading: true});
      UserService.changeAddress(address)
        .then(() => {
          Promise.all([
            this.props.updateIsForced(true),
            this.props.checkAuth(),
          ]).then(() => {
            this.props.updateIsForced(false);
            this.setState({isLoading: false});
            this.props.navigation.goBack();
          })
        })
        .catch(error => {
          this.props.updateIsForced(false);
          this.setState({isLoading: false});
          alert(error.message);
        })
    }
  }

  render() {
    const {navigation, location} = this.props;
    const fromRouter = navigation.getParam('from', 'Merchant');
    const {isLoading, errors, username, telephone, street} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader 
            navigation={navigation} 
            title={i18n.t(fromRouter === 'Merchant' ? 'My Address' : 'Cart')} 
          />
          <KeyboardAvoidingView
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
          {location.region && <ScrollView contentContainerStyle={styles.contentStyle}>
            <Text style={styles.title}>{i18n.t('Delivery Information')}</Text>
            <Text style={styles.label}>{i18n.t('recipient_name')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder=''
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ username: text }); this.clear('username');}}
                value={username}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('username') && <Text style={styles.errorslabel}>{'Username is required.'}</Text>}
            <Text style={styles.label}>{i18n.t('Phone')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.rowStyle}>
              <View style={styles.counrtyCode}>
                <ModalDropdown
                  style={{flex: 1}}
                  textStyle={styles.textStyle}
                  dropdownStyle={{width: dynamicSize(60), paddingHorizontal: dynamicSize(10)}}
                  defaultIndex={0}
                  defaultValue={'+95'}
                  options={['+95']}
                  onSelect={(index) => this.onSelectCode(index)}	
                />
                <Icon style={{position: 'absolute', right: dynamicSize(10)}} name='caret-down' color='gray' size={dynamicSize(13)} />
              </View>
              <View style={[styles.inputContainer, {width: '75%'}]}>
                <TextInput
                  style={styles.textInput}
                  placeholder=''
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  keyboardType={'numeric'}
                  onChangeText={(text) => {this.setState({ telephone: text.replace(/[^0-9]/g, '')}); this.clear('telephone');}}
                  value={telephone}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            {errors.includes('telephone') && <Text style={[styles.errorslabel, {paddingLeft: dynamicSize(100)}]}>{'Phone number is required.'}</Text>}
            <Text style={styles.label}>{i18n.t('State/Division')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.dropdown}>
              <ModalDropdown
                ref={ref => this.selecter1 = ref}
                style={{flex: 1}}
                textStyle={styles.textStyle}
                dropdownStyle={{
                  width: dynamicSize(360),
                  height: dynamicSize(300),
                  paddingHorizontal: dynamicSize(10)
                }}
                defaultIndex={-1}
                defaultValue={'Select State/Division'}
                options={location.region ? this.getValues(location.region) : []}
                onSelect={(index) => this.onSelectState(index)}
              />
              <Icon style={{position: 'absolute', right: dynamicSize(10)}} name='caret-down' color='gray' size={dynamicSize(13)} />
            </View>
            {errors.includes('region_id') && <Text style={styles.errorslabel}>{'State/Division is required.'}</Text>}
            <Text style={styles.label}>{i18n.t('Region')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.dropdown}>
              <ModalDropdown
                ref={ref => this.selecter2 = ref}
                style={{flex: 1}}
                textStyle={styles.textStyle}
                dropdownStyle={{width: dynamicSize(360), paddingHorizontal: dynamicSize(10)}}
                defaultIndex={-1}
                defaultValue={'Select Region'}
                options={location.city ? this.getValues(location.city) : []}
                onSelect={(index) => this.onSelectRegion(index)}
              />
              <Icon style={{position: 'absolute', right: dynamicSize(10)}} name='caret-down' color='gray' size={dynamicSize(13)} />
            </View>
            {errors.includes('city_id') && <Text style={styles.errorslabel}>{'Region is required.'}</Text>}
            <Text style={styles.label}>{i18n.t('Township')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.dropdown}>
              <ModalDropdown
                ref={ref => this.selecter3 = ref}
                style={{flex: 1}}
                textStyle={styles.textStyle}
                dropdownStyle={{width: dynamicSize(360), paddingHorizontal: dynamicSize(10)}}
                defaultIndex={-1}
                defaultValue={'Select Township'}
                options={location.township ? this.getValues(location.township) : []}
                onSelect={(index) => this.onSelectTown(index)}
              />
              <Icon style={{position: 'absolute', right: dynamicSize(10)}} name='caret-down' color='gray' size={dynamicSize(13)} />
            </View>
            {errors.includes('township') && <Text style={styles.errorslabel}>{'Township is required.'}</Text>}
            <Text style={styles.label}>{i18n.t('Address')} <Text style={styles.requirSymbol}>*</Text></Text>
            <View style={styles.textarea}>
              <TextInput
                style={styles.textareaInput}
                placeholder=''
                placeholderTextColor={Colors.placeholder}
                multiline={true}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {this.setState({ street: text}); this.clear('street');}}
                value={street}
                underlineColorAndroid="transparent"
              />
            </View>
            {errors.includes('street') && <Text style={styles.errorslabel}>{'Address is required.'}</Text>}
            <TouchableOpacity style={styles.button} onPress={this.onClickSave}>
              <Text style={styles.bntLabel}>  {i18n.t('Update')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitButton} onPress={this.onClickExit}>
              <FontAwesomeIcon name='close' size={dynamicSize(25)} />
            </TouchableOpacity>
          </ScrollView>}
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
  contentStyle: {
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  textInput: {
    flex: 1,
    height: dynamicSize(30),
    paddingVertical: 0,
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  title: {
    width: '100%',
    marginTop: dynamicSize(20),
    fontSize: dynamicSize(17),
    fontWeight: 'bold',
    color: '#212529',
  },
  label: {
    width: '100%',
    marginTop: dynamicSize(10),
    fontSize: dynamicSize(13),
    color: '#212529',
  },
  requirSymbol: {
    color: Colors.red,
  },
  counrtyCode: {
    width: dynamicSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  textStyle: {
    flex: 1,
    height: dynamicSize(30),
    paddingHorizontal: dynamicSize(5),
    textAlignVertical: 'center',
    fontSize: dynamicSize(13),
    color: 'gray',
  },
  rowStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textarea: {
    width: '100%',
    minHeight: dynamicSize(100),
    paddingVertical: dynamicSize(5),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textareaInput: {
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  button: {
    width: '100%',
    marginVertical: dynamicSize(20),
    paddingVertical: dynamicSize(10),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bntLabel: {
    fontSize: dynamicSize(15),
    color: 'white',
  },
  dropdown: {
    width: dynamicSize(360),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  exitButton: {
    position: 'absolute',
    top: dynamicSize(45),
    right: dynamicSize(20),
  },
  errorslabel: {
    width: '100%',
    fontSize: dynamicSize(13),
    color: Colors.red,
  }
});

const mapStateToProps = ({ auth, user, location }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: user.user,
  location: location.location,
});

const mapDispatchToProps = {
  updateIsForced,
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchLocation,
  clearLocation,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAddress);