import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LogoutModal from 'react-native-modal';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import LoadingComponent from '../components/LoadingComponent';

import {checkAuth, fetchAdminToken, customerLogout} from '@app/store/actions/auth';
import {setRedirectLink} from '@app/store/actions/loading';
import {
  fetchMerchantInfo,
  fetchPurchaseHistory,
  fetchSaleHistory,
  fetchSellerProducts,
} from '@app/store/actions/merchant';

import {setLanguage} from '@app/store/actions/user';

class Merchant extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    // navigation.getParam('requiresAuth');

    this.state = {
      tabs: ['Buyer', 'Seller'],
      selectedTab: 'Buyer',
      showLangModal: false,
      showLogoutModal: false,
      my_seller_id: this.props.user.id,
      isLoading: false,
      logoutModalShown: false,
    };

    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      this.setState({isLoading: true});

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        const {routeName, params} = state;
        const {id, email} = this.props.user;
        if(this.props.isLogged) {
          Promise.all([
            this.props.fetchMerchantInfo({email}),
            this.props.fetchPurchaseHistory(id),
            this.props.fetchSaleHistory(id),
            this.props.fetchSellerProducts({
              store_id: this.props.lang == 'mm' ? 3 : 1,
              seller_id: id,
            }),
          ]).then(() => {
            this.setState({isLoading: false});
          })
          .catch(() => {
            this.setState({isLoading: false});
          })
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch(error => {
        Alert.alert('error', error);
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
    this.blurListener = navigation.addListener('didBlur', ({state, action}) => {
      this.setState({isLoading: false});
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
    this.blurListener.remove();
  }
  
  clickRegister = () => {
    const {navigation} = this.props;
    this.props.setRedirectLink(navigation.state.routeName);
    navigation.navigate('Register', {next: 'Account'});
  }

  clickLogin = () => {
    const {navigation} = this.props;
    this.props.setRedirectLink(navigation.state.routeName);
    navigation.navigate('Login', {next: 'Account'});
  }

  clickLogout = () => {
    this.setState({
      logoutModalShown: true,
    });
  }

  clickHelp = () => {
    this.props.navigation.navigate('Help');
  }

  showLangModal = () => {
    this.setState({showLangModal: true});
  }

  handleLanguageChange = (lang) => {
    i18n.locale = lang;
    this.props.setLanguage(lang);
    this.setState({showLangModal: false});
  }

  clickSeller = () => {
    this.setState({selectedTab: 'Seller'});
  }

  clickWishlist = () => {
    this.props.navigation.navigate('Wish');
  }

  clickPurchaseHistory = () => {
    this.props.navigation.navigate('BuyerInCart');
  }
  
  clickMyCart = () => {
    this.props.navigation.navigate('BuyerInCart');
  }
  
  clickSellerToConfirm = () => {
    this.props.navigation.navigate('BuyerSellerToConfirm');
  }
  
  clickToReceive = () => {
    this.props.navigation.navigate('BuyerToReceive');
  }
  
  clickCompleted = () => {
    this.props.navigation.navigate('BuyerComplete');
  }

  clickProfile = () => {
    this.props.navigation.navigate('MyProfile');
  }

  clickAddress = () => {
    this.props.navigation.navigate('MyAddress', { from: 'Merchant' });    
  }

  clickReviews = () => {
    this.props.navigation.navigate('MyReviews');
  }  
  
  clickOpenShop = () => {

  }

  clickFollower = () => {
    this.props.navigation.navigate('FollowerList');
  }

  clickFollowing = () => {
    this.props.navigation.navigate('FollowingList');
  }

  ///////////////// computed /////////
  userImage() {
    if (this.props.merchantInfo.profile_image) {
      return this.props.merchantInfo.profile_image
    }
    return 'https://ik.imagekit.io/5ydszqfee/avatar/noimage.png'
  };
  sellerImage() {
    if (this.props.merchantInfo.logo_pic) {
      return this.props.merchantInfo.logo_pic
    }
    return 'https://ik.imagekit.io/5ydszqfee/avatar/noimage.png'
  };
  cartCount() {
    if (
      this.props.purchaseHistory &&
      this.props.purchaseHistory.incart &&
      this.props.purchaseHistory.incart[0] &&
      this.props.purchaseHistory.incart[0].totalItem
    ) {
      return this.props.purchaseHistory.incart[0].totalItem;
    }
    return 0
  };
  sellerToConfirmCount() {
    if (
      this.props.purchaseHistory.total &&
      this.props.purchaseHistory.total.seller_to_confirm
    ) {
      return this.props.purchaseHistory.total.seller_to_confirm.order_count
    }
    return 0
  };
  toReceiveCount() {
    if (this.props.purchaseHistory.total && this.props.purchaseHistory.total.to_recieve) {
      return this.props.purchaseHistory.total.to_recieve.order_count
    }
    return 0
  };
  reviewCount() {
    if (this.props.purchaseHistory.total && this.props.purchaseHistory.total.review) {
      return this.props.purchaseHistory.total.review.order_count
    }
    return 0
  }
  ////////////////////////////////////
  renderInfo() {
    const {isLogged, merchantInfo} = this.props;
    const {selectedTab} = this.state;
    if(!isLogged) {
      return null;
    }
    return (
      <View style={styles.infoView}>
        <Image style={styles.avatar} source={{uri: selectedTab == 'Buyer' ? this.userImage() : this.sellerImage()}}/>
        <View style={styles.infoBox}>
          <Text style={styles.name}>{selectedTab == 'Buyer' ? merchantInfo.firstname : merchantInfo.shop_title}</Text>
          <Text style={styles.email}>{merchantInfo.email}</Text>
          <View style={styles.followView}>
            <TouchableOpacity onPress={this.clickFollower}>
              <Text style={styles.follow}>{i18n.t('Follower')} {merchantInfo.follower}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.clickFollowing}>
              <Text style={styles.follow}>{i18n.t('Following')} {merchantInfo.following}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderGuest() {
    const {isLogged} = this.props;
    if(isLogged) {
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.listItem} onPress={this.clickHelp}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='question-circle' size={dynamicSize(22)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Help')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.showLangModal}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='globe' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Language')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
      </View>
    );
  }

  renderBuyer() {
    const {isLogged, merchantInfo} = this.props;
    const {selectedTab} = this.state;
    if(!isLogged || selectedTab != 'Buyer') {
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.listItem} onPress={this.clickPurchaseHistory}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Image style={styles.iconImg} source={require('@app/assets/img/purchasec.png')}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Purchase')}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>{i18n.t('Purchase History')}</Text>
            <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
          </View>
        </TouchableOpacity>
        <View style={styles.catagory}>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickMyCart}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/shopping-cart.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('My Cart')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{this.cartCount()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickSellerToConfirm}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/3d.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Seller To Confirm')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{this.sellerToConfirmCount()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickToReceive}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/return.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('To Receive')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{this.toReceiveCount()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickCompleted}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/edit.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Completed')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{this.reviewCount()}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.listItem} onPress={this.clickProfile}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='user-alt' size={dynamicSize(18)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Profile')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickAddress}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='map-marker' size={dynamicSize(18)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Address')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickReviews}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='star' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Reviews')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickWishlist}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='heart' size={dynamicSize(18)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Wishlist')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickHelp}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='question-circle' size={dynamicSize(22)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Help')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.showLangModal}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='globe' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Language')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickLogout}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='sign-out' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Logout')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        {merchantInfo.is_seller ?
        <TouchableOpacity style={styles.confButton} onPress={this.clickSeller}>
          <Icon name='home' size={dynamicSize(14)} color={Colors.white}/>
          <Text style={styles.btnLabel}>{i18n.t('Seller')}</Text>
        </TouchableOpacity> :
        <TouchableOpacity style={styles.confButton} onPress={this.clickOpenShop}>
        <Icon name='home' size={dynamicSize(14)} color={Colors.white}/>
        <Text style={styles.btnLabel}>{i18n.t('Open Shop')}</Text>
      </TouchableOpacity>}
      </View>
    );
  }

  renderSeller() {
    const {isLogged, saleHistory, sellerProducts} = this.props;
    const {selectedTab} = this.state;
    if(!isLogged || selectedTab != 'Seller') {
      return null;
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.listItem} onPress={this.clickHistory}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Image style={styles.iconImg} source={require('@app/assets/img/my-salec.png')}/>
            </View>
            <Text style={styles.label}>{i18n.t('My Sales')}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>{i18n.t('View Sales History')}</Text>
            <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
          </View>
        </TouchableOpacity>
        <View style={styles.catagory}>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickConfirmStock}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/3d.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Confirm Stock')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{saleHistory.confirm_stock && saleHistory.confirm_stock.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickProcesses}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/delivery-man.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Delivery Processes')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{saleHistory.delivery_process && saleHistory.delivery_process.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickCompleted}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/complete.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Completed')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{saleHistory.complete && saleHistory.complete.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catagoryItem} onPress={this.clickCancelled}>
            <Image style={styles.catagoryIcon} source={require('@app/assets/img/ship.png')} />
            <Text style={styles.catagoryTitle}>{i18n.t('Cancelled / Return / Refund')}</Text>
            <View style={styles.notifyBg}>
              <Text style={styles.notifyTxt}>{saleHistory.return_refund && saleHistory.return_refund.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.confButton} onPress={this.clickAddProduct}>
          <Icon name='plus' size={dynamicSize(18)} color={Colors.white}/>
          <Text style={styles.btnLabel}>{i18n.t('Add New Product')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickProfile}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='user-circle' size={dynamicSize(19)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Store Profile')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickProducts}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='shopping-cart' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Products')} ({sellerProducts.all && sellerProducts.all.length})</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickPayment}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='credit-card' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Payment Info')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickReviews}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='star' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Product Reviews')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickLocation}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <Icon name='map-marker' size={dynamicSize(20)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Pick-Up location')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.clickHelp}>
          <View style={styles.iconBox}>
            <View style={styles.iconBorder}>
              <FontAwesomeIcon name='question-circle' size={dynamicSize(22)} color={Colors.red}/>
            </View>
            <Text style={styles.label}>{i18n.t('Help')}</Text>
          </View>
          <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItem, {marginVertical: 10, borderBottomWidth: 0}]} onPress={this.clickStoreShow}>
          <View style={styles.iconBox}>
            <Text style={styles.label}>{i18n.t('View_My_Shop')}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>{'barlolo.com.my-store/'}</Text>
            <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {isLogged, merchantInfo, customerLogout} = this.props;
    const {selectedTab, showLangModal, isLoading, logoutModalShown} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.sliderImg}>
            {!isLogged ?
            <Image style={styles.image} source={require('../assets/img/slider/category-slider.jpg')}/>
            : <Image style={styles.image} source={{uri: merchantInfo.banner_pic}}/>}
          </View>
          {this.renderInfo()}
          {isLogged && <View style={styles.selecter}>
            <TouchableOpacity
              style={[styles.tabItem, selectedTab == 'Buyer' && {borderBottomWidth: 2}]}
              onPress={() => this.setState({selectedTab: 'Buyer'})}
            >
              <Text style={[styles.tabLabel, selectedTab == 'Buyer' && {color: Colors.red}]}>{i18n.t('Buyer')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={ !merchantInfo.is_seller }
              style={[styles.tabItem, selectedTab == 'Seller' && {borderBottomWidth: 2}]}
              onPress={() => this.setState({selectedTab: 'Seller'})}
            >
              <Text style={[
                styles.tabLabel,
                selectedTab == 'Seller' && {color: Colors.red},
                !merchantInfo.is_seller && {color: 'gray'}
              ]}>{i18n.t('Seller')}</Text>
            </TouchableOpacity>
          </View>}

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
          >
            {this.renderGuest()}
            {this.renderBuyer()}
            {this.renderSeller()}
          </ScrollView>
          {!isLogged && <View style={styles.btnBox}>
            <TouchableOpacity style={styles.button1} onPress={this.clickRegister}>
              <Text style={[styles.label, {color: Colors.white}]}>{i18n.t('Register')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={this.clickLogin}>
              <Text style={styles.label}>{i18n.t('Sign In')}</Text>
            </TouchableOpacity>
          </View>}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showLangModal}
            onRequestClose={() => {
          }}>
            <View style={[styles.container, {backgroundColor: '#000000ad'}]}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{i18n.t('Select Language')}</Text>
                  <TouchableOpacity onPress={() => this.setState({showLangModal: false})}>
                    <Text style={styles.modalExit}>x</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.modalListItem} onPress={() => this.handleLanguageChange('mm')}>
                  <Text style={styles.modalItemLabel}>မြန်မာ</Text>
                  <Image style={styles.modalItemIcon} source={require('../assets/img/myanmar.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalListItem} onPress={() => this.handleLanguageChange('en')}>
                  <Text style={styles.modalItemLabel}>English</Text>
                  <Image style={styles.modalItemIcon} source={require('../assets/img/eng.png')}/>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <LoadingComponent visible={isLoading}/>
          <LogoutModal
            isVisible={logoutModalShown}
            onBackButtonPress={() => this.setState({ logoutModalShown: false })}
            onBackdropPress={() => this.setState({ logoutModalShown: false })}
            style={styles.logoutModalContainer}
          >
            <View style={styles.logoutModalContent}>
              <View style={styles.logoutModalContentHeader}>
                <Text style={styles.logoutModalHeaderText}>
                  {i18n.t('Confirm Logout')}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ logoutModalShown: false })}>
                  <FontAwesomeIcon name="close" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.logoutModalContentMain}>
                <TouchableOpacity
                  onPress={() => {
                    customerLogout();
                    this.setState({ logoutModalShown: false });
                  }}
                  style={styles.logoutModalButton}
                >
                  <Text style={styles.logoutModalButtonText}>{i18n.t('Yes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ logoutModalShown: false })}
                  style={{ ...styles.logoutModalButton, marginLeft: dynamicSize(7) }}
                >
                  <Text style={styles.logoutModalButtonText}>{i18n.t('No')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LogoutModal>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  sliderImg: {
    width: '100%',
    height: '18%',
    backgroundColor: 'gray',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoView: {
    position: 'absolute',
    top: '3%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginHorizontal: dynamicSize(25),
    width: dynamicSize(50),
    height: dynamicSize(50),
    borderRadius: dynamicSize(25),
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  infoBox: {
  },
  name: {
    fontSize: dynamicSize(20),
    color: Colors.white,
  },
  email: {
    lineHeight: dynamicSize(35),
    fontSize: dynamicSize(18),
    color: Colors.white,
  },
  followView: {
    flexDirection: 'row',
  },
  follow: {
    marginRight: dynamicSize(12),
    fontSize: dynamicSize(15),
    fontWeight: 'bold',
    color: Colors.white,
    opacity: 0.6,
  },
  iconImg: {
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
  },
  selecter: {
    width: '100%',
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    paddingVertical: dynamicSize(10),
    borderColor: Colors.red,
  },
  tabLabel: {
    fontSize: dynamicSize(15),
    fontWeight: 'bold',
    color: Colors.black,
    alignSelf: 'center',
  },
  scroll: {
    marginTop: dynamicSize(10),
    flex: 1,
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
  contentStyle: {
    paddingTop: dynamicSize(10),
    paddingHorizontal: '3%',
    alignItems: 'center',
  },
  listItem: {
    paddingHorizontal: '3%',
    paddingVertical: dynamicSize(10),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  iconBox: {
    // width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBorder: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    borderRadius: dynamicSize(15),
    borderWidth: 1,
    borderColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBox: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: '3%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  button1: {
    width: '48%',
    paddingVertical: dynamicSize(10),
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderColor: Colors.red,
    borderWidth: 1,
  },
  button2: {
    width: '48%',
    paddingVertical: dynamicSize(10),
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderColor: Colors.red,
    borderWidth: 1,
  },
  label: {
    paddingHorizontal: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.red,
  },
  modalContainer: {
    top: '20%',
    width: '95%',
    height: '25%',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: '5%',
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:Colors.red,
  },
  modalTitle: {
    fontSize: dynamicSize(18),
    color: Colors.white,
  },
  modalExit: {
    fontSize: dynamicSize(20),
    fontWeight: 'bold',
    color: Colors.white,
  },
  modalListItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  modalItemLabel: {
    marginLeft: '10%',
    fontSize: dynamicSize(16),
  },
  modalItemIcon: {
    marginRight: '35%',
  },
  confButton: {
    marginTop: dynamicSize(20),
    marginBottom: dynamicSize(10),
    width: '100%',
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(15),
    color: Colors.white,
  },
  catagory: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catagoryItem: {
    width: dynamicSize(90),
    paddingTop: dynamicSize(15),
    alignItems: 'center',
  },
  catagoryIcon: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    resizeMode: 'contain',
  },
  catagoryTitle: {
    textAlign: 'center',
    color: Colors.gray,
  },
  notifyBg: {
    position: 'absolute',
    top: dynamicSize(12),
    right: dynamicSize(20),
    width: dynamicSize(20),
    height: dynamicSize(20),
    borderRadius: dynamicSize(10),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyTxt: {
    fontSize: dynamicSize(12),
    color: 'white',
  },
  logoutModalContainer: {
		alignItems: 'center',
	},
	logoutModalContent: {
		width: SCREEN_WIDTH * 0.9,
		borderRadius: dynamicSize(6),
		overflow: 'hidden',
	},
	logoutModalContentHeader: {
		flexDirection: 'row',
		backgroundColor: Colors.red,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	logoutModalHeaderText: {
		color: Colors.white,
		fontSize: dynamicSize(20),
	},
	logoutModalContentMain: {
    flexDirection: 'row',
		backgroundColor: Colors.white,
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	logoutModalContentText: {
		color: Colors.black,
		fontSize: dynamicSize(16),
  },
  logoutModalButton: {
    backgroundColor: Colors.red,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dynamicSize(5),
  },
  logoutModalButtonText: {
    color: Colors.white,
    fontSize: dynamicSize(18),
  }
});

const mapStateToProps = ({ auth, user, merchant }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  merchantInfo: merchant.merchantInfo,
  purchaseHistory: merchant.purchaseHistory,
  saleHistory: merchant.saleHistory,
  sellerProducts: merchant.sellerProducts,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  setLanguage,

  fetchMerchantInfo,
  fetchPurchaseHistory,
  fetchSaleHistory,
  fetchSellerProducts,

  customerLogout,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Merchant);