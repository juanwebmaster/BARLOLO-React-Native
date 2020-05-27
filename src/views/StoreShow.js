import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  fetchSellerUniqueId,
  clearShop,
  fetchShop,
  fetchFeatureProducts,
  fetchProducts,
} from '../store/actions/shop';
import MerchantService from '../services/MerchantService';

import FallbackImage from '../components/FallbackImage';
import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';
import ProductsCard from '../components/ProductsCard';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, dynamicSize} from '../config';

class StoreHeder extends React.Component {
  state = {
    isLoading: false,
  }

  handleIsNotLoggedIn = () => {
    this.props.setRedirectLink(this.props.navigation.state.routeName)
    this.props.navigation.navigate('Login');
  }

  clickContact = (id) => {
    const {navigation} = this.props;
    navigation.navigate('ChatBox', { uniqueId: id })
  }

  follow = async() => {
    const {isLogged, user, shop} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }
    this.setState({isLoading: true});
    Promise.all([
      MerchantService.postFollow(
        user.id,
        shop.store.seller_id
      ),
      this.props.fetchShop({
        sellerId: shop.store.seller_id,
        limit: 10,
        pageNo: 0,
        field: null,
        direction: null,
        filterValue: 0,
        customreId: user.id || 0
      }),
    ])
    .then(res => {
      this.setState({isLoading: false});
    })
    .error(error => {
      console.log(error);
      this.setState({isLoading: false});
    })
  }

  unfollow = async() => {
    const {isLogged, user, shop} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }
    this.setState({isLoading: true});
    Promise.all([
      MerchantService.postUnfollow(
        user.id,
        shop.store.seller_id,
      ),
      this.props.fetchShop({
        sellerId: shop.store.seller_id,
        limit: 10,
        pageNo: 0,
        field: null,
        direction: null,
        filterValue: 0,
        customreId: user.id || 0
      }),
    ])
    .then(res => {
      this.setState({isLoading: false});
    })
    .error(error => {
      console.log(error);
      this.setState({isLoading: false});
    })
  }

  ago() {
    return this.props.shop.store ? moment()
      .subtract(this.props.shop.store.join_days, 'days')
      .fromNow()
      : ''
  }

  _renderItem = ({item, index}) => {
    return (
      <ProductsCard
          key={index}
          data={item}
          navigation={this.props.navigation}
          style={index % 2 ? {borderLeftWidth: 0} : {marginLeft: 10}}
      />
    );
  }

  render() {
    const {navigation, featureProducts, shop, sellerUniqueId} = this.props;
    const {isLoading} = this.state;
    return (
      <View style={{width: SCREEN_WIDTH}} removeClippedSubviews={true}>
        {shop.store &&<View style={styles.storeInfo}>
          <Image style={styles.image} source={{uri: shop.store.banner_pic}}/>
          <View style={styles.overlay}/>
          <View style={styles.infoBody}>
            <View style={styles.info}>
              <View style={styles.logoView}>
                <Image style={styles.logo} source={{uri: shop.store.logo_pic}}/>
              </View>
              <View style={styles.infoContents}>
                <View style={styles.rowStyle}>
                  {shop.store.badge_image_url &&
                  <FallbackImage style={styles.badge} source={shop.store.badge_image_url}/>}
                  <Text style={styles.shopTitle}>{shop.store.shop_title ? shop.store.shop_title : shop.store.shop_url}</Text>
                </View>
                <View style={styles.rowStyle}>
                  <TouchableOpacity>
                    <Text style={styles.follower}>{i18n.t('Followers')} ({shop.store.follower})  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.follower}>|  {i18n.t('Followings')} ({shop.store.following})</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>}
        <View style={styles.rowfillStyle}>
          {shop.store && shop.store.is_following == 0 ?
          <TouchableOpacity style={styles.followeBtn} onPress={this.follow}>
            <Icon name='plus' size={dynamicSize(13)} color='white'/>
            <Text style={styles.followeBtnLabel}>{i18n.t('Follow')}</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={styles.followeBtn} onPress={this.unfollow}>
            <Text style={styles.followeBtnLabel}>{i18n.t('Following')}</Text>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.chatSeller} onPress={() => this.clickContact(sellerUniqueId)}>
            <FontAwesomeIcon name='envelope' size={dynamicSize(13)} color='gray'/>
            <Text style={styles.chatSellerLabel}>{i18n.t('Chat Seller')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowfillStyle}>
          <View style={styles.colItem}>
            <Icon name='shopping-cart' size={dynamicSize(15)} color='gray'/>
            <Text style={styles.count}>{shop.store && shop.store.products_count}</Text>
            <Text style={styles.label}>{i18n.t('Products')}</Text>
          </View>
          <View style={styles.colItem}>
            <FontAwesomeIcon name='star' size={dynamicSize(18)} color='gray'/>
            <Text style={styles.count}>{shop.store && shop.store.avg}</Text>
            <Text style={styles.label}>{i18n.t('ratings')}</Text>
          </View>
          <View style={[styles.colItem, {borderRightWidth: 0}]}>
            <FontAwesomeIcon name='user' size={dynamicSize(18)} color='gray'/>
            <Text style={styles.count}>{this.ago()}</Text>
            <Text style={styles.label}>{i18n.t('Joined')}</Text>
          </View>
        </View>
        {featureProducts.length > 0 &&
        <View style={{width: SCREEN_WIDTH}}>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{i18n.t('featured_product')}</Text>
          </View>
          <View style={styles.headerBottom} />
          <FlatList
            // contentContainerStyle={{alignItems: 'center'}}
            data={featureProducts}
            renderItem={this._renderItem}
            keyExtractor={item => item.entity_id}
            numColumns={2}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          />
        </View>}
        <View style={styles.titleBar}>
            <Text style={styles.title}>{i18n.t('Products')}</Text>
        </View>
        <View style={styles.headerBottom} />
        <LoadingComponent visible={isLoading}/>
      </View>
    );
  }
}

class StoreShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      loading: false,
      refreshing: false,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }    
      const {routeName, params} = state; 
      if(!params || !params.id) {
        navigation.goBack();
        return;
      }
      this.setState({
        isLoading: true,
      });
      const {user, lang} = this.props;
      const sellerId = params.id;

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.fetchSellerUniqueId(sellerId),
        this.props.clearShop(),
        this.props.fetchShop({
          sellerId,
          limit: 10,
          pageNo: 0,
          field: null,
          direction: null,
          filterValue: 0,
          customreId: user.id || 0
        }),
      ]).then(() => {
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchFeatureProducts({
          storeId,
          productIdList: this.featureProductIdList(),
        });
        this.handleRefresh();
        this.setState({isLoading: false});
      })
      .catch(error => {
        // alert(error);
        navigation.goBack();
        this.setState({isLoading: false});
      })
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  featureProductIdList = () => {
    return _.join(this.props.shop.feature_id.item, ',')
  }

  handleLoadMore = () => {
      const {isLogged, lang, user, shop} = this.props;
      const {loading, pageindexid} = this.state;
      if(!loading && pageindexid <= shop.product_id.count) {
          this.setState({loading: true});
          const storeId = lang == 'mm' ? 3 : 1;
          const itemlist = shop.product_id.item.slice(pageindexid, pageindexid+16);
          this.props.fetchProducts({
              storeId,
              customerId: isLogged ? user.id : 0,
              productIdList: itemlist,
          })
          .then(res => {
              this.setState({loading: false, pageindexid: pageindexid+16});
          })
          .catch(error => {
              console.log(error);
              this.setState({loading: false});
          })
      }
  }

  handleRefresh = () => {
    const {isLogged, lang, user, shop} = this.props;
    const {refreshing} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const storeId = lang == 'mm' ? 3 : 1;
        const itemlist = shop.product_id.item.slice(0, 16);
        this.props.fetchProducts({
            storeId,
            customerId: isLogged ? user.id : 0,
            productIdList: itemlist,
        })
        .then(res => {
            this.setState({refreshing: false, pageindexid: 16});
        })
        .catch(error => {
            console.log(error);
            this.setState({refreshing: false});
        })
    }
  }

  _renderFooter = () => {
    try {
      // Check If Loading
      if (this.state.loading) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  _renderItem = ({item, index}) => {
    return (
      <ProductsCard
          key={index}
          data={item}
          navigation={this.props.navigation}
          style={index % 2 ? {borderLeftWidth: 0} : {marginLeft: 10}}
      />
    );
  }

  render() {
    const {isLoading, refreshing} = this.state;
    const {navigation, products} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('store_details')} />
          <FlatList
            // contentContainerStyle={{alignItems: 'center'}}
            data={products}
            renderItem={this._renderItem}
            ListHeaderComponent={<StoreHeder {...this.props}/>}
            ListFooterComponent={this._renderFooter}
            keyExtractor={item => item.entity_id}
            onEndReached={this.handleLoadMore}
            // onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndThreshold={0}
            numColumns={2}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
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
  blank: {
    height: dynamicSize(10),
  },
  titleBar: {
    width: '100%',
    paddingHorizontal: dynamicSize(10),
    paddingVertical: dynamicSize(12),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
      fontSize: dynamicSize(16),
      fontWeight: 'bold',
      color: Colors.black,
  },
  headerBottom: {
    marginHorizontal: 10,
    width: SCREEN_WIDTH - 20,
    height: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  storeInfo: {
    width: '100%',
    height: dynamicSize(140),
    alignItems: 'center',
  },
  infoBody: {
    width: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000090'
  },
  info: {
    marginTop: dynamicSize(20),
    marginLeft: dynamicSize(20),
    width: '100%',
    flexDirection: 'row',
  },
  logoView: {
    width: dynamicSize(60),
    height: dynamicSize(60),
    borderRadius: dynamicSize(30),
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  infoContents: {
    marginLeft: dynamicSize(20),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  shopTitle: {
    marginLeft: dynamicSize(15),
    letterSpacing: 0.5,
    fontSize: dynamicSize(16),
    color: 'white',
  },
  follower: {
    fontSize: dynamicSize(12),
    color: 'white',
  },
  rowfillStyle: {
    flexDirection: 'row',
    width: '100%',
    padding: dynamicSize(10),
  },
  chatSeller: {
    flex: 1,
    padding: dynamicSize(8),
    marginHorizontal: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
  },
  chatSellerLabel: {
    marginLeft: dynamicSize(5),
    fontSize: dynamicSize(12),
    color: 'gray',
  },
  followeBtn: {
    flex: 1,
    padding: dynamicSize(8),
    marginHorizontal: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.red,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.red,
  },
  followeBtnLabel: {
    marginLeft: dynamicSize(5),
    fontSize: 12,
    color: 'white',
  },
  colItem: {
    flex: 1,
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRightWidth: 1,
  },
  count: {
    fontSize: dynamicSize(12),
    color: Colors.red,
  },
  label: {
    fontSize: dynamicSize(13),
    color: '#757575',
  },
});

const mapStateToProps = ({ auth, user, shop }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  shop: shop.shop,
  featureProducts: shop.featureProducts,
  products: shop.products,
  sellerUniqueId: shop.sellerUniqueId,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchSellerUniqueId,
  clearShop,
  fetchShop,
  fetchFeatureProducts,
  fetchProducts,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoreShow);