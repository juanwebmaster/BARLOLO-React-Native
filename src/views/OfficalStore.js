import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchShops, clearShops, followShop, unfollowShop} from '../store/actions/shop';

import MerchantService from '../services/MerchantService';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class OfficalStore extends React.Component {
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
      this.setState({isLoading: true});

      const storeId = this.props.lang == 'mm' ? 3 : 1;

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.clearShops(),
        this.props.fetchShops({
          storeId: storeId,
          limit: 10,
          pageNo: 1,
          storeType: 'OFFICIAL',
          customerId: this.props.user.id || 0,
        })
      ]).then(() => {
        this.setState({isLoading: false});
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

  handleIsNotLoggedIn() {
    this.props.setRedirectLink(this.props.navigation.state.routeName)
    this.props.navigation.navigate('Login');
  }

  clickChatSeller = (sellerId) => {
    const {navigation} = this.props;
    navigation.navigate('ChatBox', { uniqueId: sellerId })
  }

  follow = (shop) => {
    const {isLogged, shops, user} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }

    this.setState({isLoading: true});

    MerchantService.postFollow(
      user.id,
      shop.seller_id
    )
    .then(response => {
      this.props.followShop(shop);
      this.setState({isLoading: false});
    })
    .catch(error => {
      console.log(error)
      this.setState({isLoading: false});
    })
  }

  unfollow = (shop) => {
    const {isLogged, shops, user} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn();
    }

    this.setState({isLoading: true});

    MerchantService.postUnfollow(
      user.id,
      shop.seller_id
    )
    .then(response => {
      this.props.unfollowShop(shop);
      this.setState({isLoading: false});
    })
    .catch(error => {
      console.log(error);
      this.setState({isLoading: false});
    })
  }

  clickStore = (id) => {
    const {navigation} = this.props;
    navigation.navigate('StoreShow', { id });
  }

  clickProduct = (id, sku) => {
    const {navigation} = this.props;
    navigation.navigate('ProductShow', {id, sku});
  }

  strlimit(store){
    let shop = store.shop_title ? store.shop_title : store.shop_url
    let word = shop.length
    let limit = shop.split("", 100).join("") + '...'
    return word > 100 ? limit : shop
  }

  handleLoadMore = () => {
    const {isLogged, lang, user, pageNo, totalCount} = this.props;
    const {loading} = this.state;
    if(!loading && pageNo * 10 < totalCount) {
        this.setState({loading: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchShops({
          storeId: storeId,
          limit: 10,
          pageNo: pageNo + 1,
          storeType: 'OFFICIAL',
          customerId: isLogged ? user.id : 0,
        })
        .then(res => {
            this.setState({loading: false});
        })
        .catch(error => {
            console.log(error);
            this.setState({loading: false});
        })
    }
  }

  handleRefresh = () => {
    const {isLogged, lang, user} = this.props;
    const {refreshing} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchShops({
          storeId: storeId,
          limit: 10,
          pageNo: 1,
          storeType: 'OFFICIAL',
          customerId: isLogged ? user.id : 0,
        })
        .then(res => {
            this.setState({refreshing: false});
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
      <View style={styles.cardItem}>
        <TouchableOpacity style={styles.storeInfo} onPress={() => this.clickStore(item.seller_id)}>
          <FallbackImage style={styles.storeLogo} source={item.logo_pic}/>
          <View style={{flex: 1}} >
            <View style={[styles.rowStyle, {flex: 1, alignItems: 'flex-start'}]}>
              <Text style={styles.storeName}>{this.strlimit(item)}</Text>
              {item.badge_image_url && <FallbackImage style={styles.storeBadge} source={item.badge_image_url}/>}
            </View>
            <View style={styles.star}>
              {[1,2,3,4,5].map((i, index) => 
                <FontAwesomeIcon key={'star'+index} name='star' size={dynamicSize(16)} color={i <= item.store_rating ? Colors.yellow : '#d5d4d4'} />)}
            </View>
            <View style={styles.rowStyle}>
              <Icon name='map-marker' size={dynamicSize(13)} color='gray'/>
              <Text style={styles.label}>{item.city || ' NA'}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.rowStyle}>
            {item.images.map((product, index) => (
              <TouchableOpacity key={index} style={styles.product} onPress={() => this.clickProduct(product.entity_id, product.sku)}>
                <FallbackImage style={styles.image} source={product.image}/>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rowStyle}>
            <TouchableOpacity style={styles.chatSeller} onPress={() => this.clickChatSeller(item.unique_id)}>
              <FontAwesomeIcon name='envelope' size={dynamicSize(13)} color='gray'/>
              <Text style={styles.chatSellerLabel}>{i18n.t('Chat Seller')}</Text>
            </TouchableOpacity>
            {item.is_following == 0 ? <TouchableOpacity style={styles.followeBtn} onPress={() => this.follow(item)}>
              <Icon name='plus' size={dynamicSize(13)} color='white'/>
              <Text style={styles.followeBtnLabel}>{i18n.t('Follow')}</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={styles.followeBtn} onPress={() => this.unfollow(item)}>
              <Text style={styles.followeBtnLabel}>{i18n.t('Following')}</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {navigation, shops} = this.props;
    const {isLoading, refreshing} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Offical Store')} isCartBtn={true}/>
          <FlatList
            contentContainerStyle={styles.contentStyle}
            data={shops}
            renderItem={this._renderItem}
            ListFooterComponent={this._renderFooter}
            keyExtractor={(item, index) => item.seller_id+':'+index}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
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
  contentStyle: {
    padding: dynamicSize(5),
  },
  cardItem: {
    width: SCREEN_WIDTH/2-dynamicSize(7),
    margin: dynamicSize(2),
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  storeLogo: {
    width: dynamicSize(55),
    height: dynamicSize(55),
    resizeMode: 'contain',
  },
  storeInfo: {
    flex: 1,
    padding: dynamicSize(5),
    flexDirection: 'row',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  rowStyle: {
    padding: dynamicSize(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeBadge: {
    alignSelf: 'flex-start',
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
  },
  storeName: {
    flex: 1,
    paddingRight: dynamicSize(5),
    fontSize: dynamicSize(13),
    fontWeight: 'bold',
    color: Colors.red,
  },
  label: {
    flex: 1,
    paddingHorizontal: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: 'gray',
  },
  product: {
    flex: 1,
    height: dynamicSize(40),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  chatSeller: {
    width: dynamicSize(90),
    padding: dynamicSize(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
  },
  chatSellerLabel: {
    marginLeft: dynamicSize(5),
    fontSize: dynamicSize(11),
    color: 'gray',
  },
  followeBtn: {
    width: dynamicSize(80),
    padding: dynamicSize(5),
    margin: dynamicSize(5),
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
    fontSize: dynamicSize(11),
    color: 'white',
  },
  star: {
    marginLeft: dynamicSize(5),
    flexDirection: 'row',
  },
});

const mapStateToProps = ({ auth, user, shop }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  shops: shop.shops,
  pageNo: shop.pageNo,
  totalCount: shop.totalCount,
});

const mapDispatchToProps = {
  checkAuth, fetchAdminToken, setRedirectLink,
  clearShops,
  fetchShops,
  followShop,
  unfollowShop,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfficalStore);