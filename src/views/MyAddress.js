import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import {updateIsForced, checkAuth, fetchAdminToken} from '../store/actions/auth';
import {makeDefaultAddress, deleteAddress} from '../store/actions/user';
import {setRedirectLink} from '../store/actions/loading';

import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class MyAddress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      deleteModalShown: false,
      address: null,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({isLoading: true});

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        this.setState({isLoading: false});

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

  makeDefaultAddress(defaultAddress) {
    this.setState({isLoading: true});

    let address = {
      customer_id: this.props.user.id,
      email: this.props.user.email,
      address: {
        address_id: defaultAddress.id,
        default_billing: 1,
        default_shipping: 1
      }
    }

    this.props.makeDefaultAddress(address)
      .then(() => {
        Promise.all([
          this.props.updateIsForced(true),
          this.props.checkAuth(),
        ]).then(() => {
          this.props.updateIsForced(false);
          this.listRef.scrollToOffset({offset: 0});
          this.setState({isLoading: false});
        })
      })
      .catch(() => {
        this.setState({isLoading: false});
      })
  }

  deleteAddress(address) {
    this.setState({isLoading: true});

    this.props.deleteAddress(address)
      .then(() => {
        this.setState({isLoading: false});
      })
      .catch(() => {
        this.setState({isLoading: false});
      })
  }

  onClickEdit(address) {
    const fromRouter = this.props.navigation.getParam('from', 'Merchant');
    this.props.navigation.navigate('EditAddress', {address, from: fromRouter})
  }

  onClickDelete(address) {
    this.setState({
      deleteModalShown: true,
      address,
    });
  }

  onClickAddAddress = () => {
    this.props.navigation.navigate('CreateAddress', {from: 'MyAddress'});
  }

  _renderItem = ({item, index}) => {
    const {defaultAddress} = this.props;
    if(index > 0 && item.id === defaultAddress.id) return <View/>;
    return (
      <View style={styles.cardItem}>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>{ item.firstname } { item.lastname }</Text>
          <TouchableOpacity
            disabled={item.id === defaultAddress.id}
            onPress={() => this.makeDefaultAddress(item)}
          >
            <Text style={styles.redLabel}>{i18n.t(item.id === defaultAddress.id ? 'Default' : 'Set_as_default')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.seperator}/>
        <View style={styles.rowStyle}>
          <FontAwesomeIcon style={{alignSelf: 'flex-start'}} name='map-marker' size={dynamicSize(15)} color='#666666' />
          <View style={styles.addressBox}>
            <Text style={styles.label}>{item.street && item.street[0]}</Text>
            <Text style={styles.label}>{item.city}, {item.region.region}</Text>
            <Text style={styles.label}>{item.country_id}</Text>
          </View>
        </View>
        <View style={styles.seperator}/>
        <View style={styles.rowStyle}>
          <FontAwesomeIcon name='phone' size={dynamicSize(15)} color='#666666' />
          <Text style={[styles.telephone]}>{item.telephone}</Text>
        </View>
        <View style={styles.rowStyle}>
          <TouchableOpacity style={styles.button} onPress={() => this.onClickEdit(item)}>
            <Text style={styles.btnLabel}>{i18n.t('Edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.onClickDelete(item)}>
            <Text style={styles.btnLabel}>{i18n.t('Delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const {navigation, user, defaultAddress} = this.props;
    const fromRouter = navigation.getParam('from', 'Merchant');
    const {isLoading, deleteModalShown, address} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader 
            navigation={navigation} 
            title={i18n.t(fromRouter === 'Merchant' ? 'My Address' : 'Cart')} 
          />
          <FlatList
            ref={ref => {
              this.listRef = ref;
            }}
            data={defaultAddress ? [defaultAddress, ...user.addresses] : []}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.id.toString()+index}
            // onEndReached={this.handleLoadMore}
            // onEndThreshold={0}
            ListFooterComponent={<View style={{height: dynamicSize(10)}}/>}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          />
          <TouchableOpacity style={styles.addButton} onPress={this.onClickAddAddress}>
            <Icon name='plus' size={dynamicSize(13)} color='white'/>
            <Text style={styles.addButtonLabel}>  {i18n.t('Add Address')}</Text>
          </TouchableOpacity>
          <LoadingComponent visible={isLoading}/>
          <Modal
            isVisible={deleteModalShown}
            onBackButtonPress={() => this.setState({ deleteModalShown: false })}
            onBackdropPress={() => this.setState({ deleteModalShown: false })}
            style={styles.deleteModalContainer}
          >
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteModalContentHeader}>
                <Text style={styles.deleteModalHeaderText}>
                  {i18n.t('delete_alert')}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ deleteModalShown: false })}>
                  <FontAwesomeIcon name="close" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.deleteModalContentMain}>
                <TouchableOpacity
                  onPress={() => {
                    this.deleteAddress(address);
                    this.setState({ deleteModalShown: false });
                  }}
                  style={styles.deleteModalButton}
                >
                  <Text style={styles.deleteModalButtonText}>{i18n.t('Yes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ deleteModalShown: false })}
                  style={{ ...styles.deleteModalButton, marginLeft: dynamicSize(7) }}
                >
                  <Text style={styles.deleteModalButtonText}>{i18n.t('No')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  addButton: {
    width: '100%',
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonLabel: {
    fontSize: dynamicSize(13),
    color: 'white',
  },
  cardItem: {
    width: '95%',
    marginTop: dynamicSize(10),
    paddingHorizontal: dynamicSize(10),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  rowStyle: {
    paddingVertical: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seperator: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: Colors.borderColor,
  },
  title: {
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  redLabel: {
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  addressBox: {
    width: '90%',
  },
  label: {
    fontSize: dynamicSize(13),
    color: '#666666',
  },
  telephone: {
    width: '90%',
    fontSize: dynamicSize(13),
    color: '#212529'
  },
  button: {
    width: '45%',
    paddingVertical: dynamicSize(10),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7D7D7',
  },
  btnLabel: {
    fontSize: dynamicSize(15),
    color: Colors.red,
  },
  deleteModalContainer: {
		alignItems: 'center',
	},
	deleteModalContent: {
		width: SCREEN_WIDTH * 0.9,
		borderRadius: dynamicSize(6),
		overflow: 'hidden',
	},
	deleteModalContentHeader: {
		flexDirection: 'row',
		backgroundColor: Colors.red,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	deleteModalHeaderText: {
		color: Colors.white,
		fontSize: dynamicSize(18),
	},
	deleteModalContentMain: {
    flexDirection: 'row',
		backgroundColor: Colors.white,
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	deleteModalContentText: {
		color: Colors.black,
		fontSize: dynamicSize(16),
  },
  deleteModalButton: {
    backgroundColor: Colors.red,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dynamicSize(5),
  },
  deleteModalButtonText: {
    color: Colors.white,
    fontSize: dynamicSize(17),
  }
});

function shippingAddress(addresses) {
  let defaultAddress = addresses.find(address => {
    return address.default_shipping;
  })

  if (!!defaultAddress) {
    return defaultAddress;
  } else {
    return _.last(addresses);
  }
}

const mapStateToProps = ({ auth, user }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: user.user,
  defaultAddress: user.user.addresses ? shippingAddress(user.user.addresses) : null,
});

const mapDispatchToProps = {
  updateIsForced,
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  makeDefaultAddress,
  deleteAddress,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAddress);