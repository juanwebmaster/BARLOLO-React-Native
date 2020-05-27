import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Modal,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import config from '../config/config';
import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  resetProductError,
  fetchProduct,
  fetchMerchantProductsSimiler,
  fetchSkuOfProduct,
  fetchProductWithSku,
  fetchProductCommentList,
  fetchRatingList,
  fetchSellerUniqueId,
  fetchCarts,
  fetchSellerProducts,
  fetchStoreSellerProducts,
  showProductComment,
  handleRemoveFromWishList,
  fetchWishlists,
} from '../store/actions/product';
import {
  addToCartItem,
  fetchQuote,
} from '../store/actions/cart';

import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';
import ToggleBack from "../components/toggle/ToggleBack";
import ToggleCart from "../components/toggle/ToggleCart";
import ToggleWish from "../components/toggle/ToggleWish";
import ProductDetailSlider from '../components/ProductDetailSlider';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductComment from '../components/ProductComment';
import MerchantService from '../services/MerchantService';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {dynamicSize} from '../config';

const initialState = {
  isLoading: false,
  showAlert: false,
};

class ProductShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      const {routeName, params} = state;
      if(!params || !params.id || !params.sku) {
        navigation.goBack();
        return;
      }
      this.setState({ initialState, isLoading: true});

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {

        const storeId = this.props.lang == 'mm' ? 3 : 1;
        this.getProductDetail(params?.id, storeId, params?.sku, this.props.user.id || 0)
        .then(() => {
          if(this.props.product.storeInfo) {
            this.props.fetchSellerProducts(
              this.props.product.storeInfo.seller_id
            )
            .then(() => {
              this.props.fetchStoreSellerProducts({
                storeId,
                customerId: this.props.user.id || 0,
                productIdList: this.productIdList()
              })
            })
          }
          if(this.scroll) this.scroll.scrollTo(0);
          this.setState({isLoading: false});
        })
        .catch(e => {
          this.setState({isLoading: false});
        })
      })
      .catch(error => {
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
  }

  getProductDetail(productId, storeId, sku, customerId) {
    return Promise.all([
      this.props.resetProductError(),
      this.props.fetchProduct({
        storeId,
        productId,
        loginId: customerId
      }),
      this.props.fetchMerchantProductsSimiler({
        productIdList: [productId],
        customerId: customerId
      }),
      this.props.fetchSkuOfProduct({
        sku,
      }),
      this.props.fetchProductWithSku({
        sku,
        storeId,
      }),
      this.props.fetchProductCommentList(productId),
      this.props.fetchRatingList(productId),
      this.props.fetchSellerUniqueId(productId),
      this.props.fetchCarts(customerId)
    ])
  }

  productIdList() {
    let productIdArr = _.take(
      _.map(this.props.sellerProducts[0].items, 'mageproduct_id'),
      5
    )
    return _.join(productIdArr, ',')
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  clickCatItem = (id) => {
    this.props.navigation.navigate('CategoryShow', {id, keyword : ''});
  }

  clickContact = (id) => {
    const {navigation} = this.props;
    navigation.navigate('ChatBox', { uniqueId: id })
  }

  clickStore = () => {
    const {navigation, product} = this.props;
    const id = product.storeInfo?.seller_id;
    navigation.navigate('StoreShow', { id });
  }

  createCartProduct() {
    const {skuProduct, user} = this.props;
    this.setState({isLoading: true});
    this.props.addToCartItem({
      sku: skuProduct.sku,
      qty: 1,
    })
    .then(res => {
      this.props.fetchCarts(user.id)
			.then(() => {
        this.setState({showAlert: true}, () => setTimeout(() => {
          this.setState({showAlert: false});
        }, 2000))
				this.setState({isLoading: false});
			})
    })
    .catch(e => {
      console.log(e);
      this.setState({isLoading: false});
    })
  }

  addCart = () => {
    const {isLogged, skuProduct} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }
    if(skuProduct.extension_attributes && skuProduct.extension_attributes.stock_item.qty) {
      this.createCartProduct();
    } else {
      this.props.navigation.navigate('SelectVariation');
    }
  }

  strlimit = (storeInfo) => {
    let shop = storeInfo.shop_title
      ? storeInfo.shop_title
      : storeInfo.shop_url
    let word = shop.length
    let limit = shop.split('', 10).join('') + '...'
    return word > 12 ? limit : shop
  }

  conditionIndex() {
    return _.findIndex(this.props.skuProduct.custom_attributes, [
      'attribute_code',
      'product_condition'
    ])
  }

  descriptionIndex() {
    return _.findIndex(this.props.skuProduct.custom_attributes, [
      'attribute_code',
      'description'
    ])
  }

  handleIsNotLoggedIn = () => {
    this.props.setRedirectLink(this.props.navigation.state.routeName)
    this.props.navigation.navigate('Login');
  }

  clickShare1 = () => {
    const {skuProduct} = this.props;
    let url = config.get('BASEURL') + 'products/' + skuProduct.id + '/' + skuProduct.sku;
    let linkUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&t=' + 'Barlolo';
    Linking.openURL(linkUrl);
  }

  clickShare2 = () => {
    const {skuProduct} = this.props;
    let url = config.get('BASEURL') + 'products/' + skuProduct.id + '/' + skuProduct.sku;
    Linking.openURL(`whatsapp://send?text=${url}`);
  }
  
  clickShare3 = () => {
    const {skuProduct} = this.props;
    let url = config.get('BASEURL') + 'products/' + skuProduct.id + '/' + skuProduct.sku;
    Linking.openURL(`viber://forward?text=${url}`);
  }
  
  clickShare4 = () => {
    const {skuProduct} = this.props;
    let url = config.get('BASEURL') + 'products/' + skuProduct.id + '/' + skuProduct.sku;
    let linkUrl = 'fb-messenger://share?link=' + encodeURIComponent(url) + '&app_id=' + encodeURIComponent(123456);
    Linking.openURL(linkUrl);
  }
  
  clickShare5 = () => {
    const {skuProduct} = this.props;
    let url = config.get('BASEURL') + 'products/' + skuProduct.id + '/' + skuProduct.sku;
    Linking.openURL('sms:?body=' + url);
  }

  follow = async() => {
    const {isLogged, user, product, skuProduct} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }

    this.setState({isLoading: true});
    const storeId = this.props.lang == 'mm' ? 3 : 1;
    Promise.all([
      MerchantService.postFollow(
        user.id,
        product.storeInfo.seller_id
      ),
      this.props.fetchProduct({
        storeId,
        productId: skuProduct.id,
        loginId: user.id,
      }),
    ])
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(error => {
      console.log(error);
      this.setState({isLoading: false});
    })
  }

  unfollow = async() => {
    const {isLogged, user, product, skuProduct} = this.props;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }
    this.setState({isLoading: true});
    const storeId = this.props.lang == 'mm' ? 3 : 1;
    Promise.all([
      MerchantService.postUnfollow(
        user.id,
        product.storeInfo.seller_id
      ),
      this.props.fetchProduct({
        storeId,
        productId: skuProduct.id,
        loginId: user.id,
      }),
    ])
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(error => {
      console.log(error);
      this.setState({isLoading: false});
    })
  }

  handleProductRating = () => {
    if (!this.props.isLogged) {
      this.handleIsNotLoggedIn()
      return
    }
    this.props.navigation.navigate('ProductRating', );
  }

  handleProductComment = () => {
    if (!this.props.isLogged) {
      this.handleIsNotLoggedIn()
      return
    }
    this.props.navigation.navigate('ProductComments', );
  }

  onClickVariations = () => {
    this.props.navigation.navigate('SelectVariation');
  }

  render() {
    const {isLoading, showAlert} = this.state;
    const {navigation, product, skuProduct, merchantProducts, merchantProductsSimiler, sellerUniqueId, skuOfProduct} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
          <ScrollView
            ref={ref => this.scroll=ref}
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
            removeClippedSubviews={true}
          >
            <View style={[styles.infoItem, {paddingTop: 0}]}>
              <View style={styles.productSlider}>
                <ProductDetailSlider images={product.product_images} />
                <ToggleBack style={styles.toggleBack} navigation={navigation} />
                <ToggleCart style={styles.toggleCart} navigation={navigation} product={skuProduct} handleIsNotLoggedIn={this.handleIsNotLoggedIn}/>
              </View>
              <View style={styles.nameBox}>
                <Text style={styles.productName}>{skuProduct.name}</Text>
                <Text style={styles.redLabel}>{
                  product.special_price && product.special_price !='Ks0' ?
                  product.special_price : product.price
                }</Text>
              </View>
                <ToggleWish style={styles.toggleWith} navigation={navigation} product={skuProduct} handleIsNotLoggedIn={this.handleIsNotLoggedIn}/>
              <View style={styles.rankingCom}>
                <TouchableOpacity style={styles.ranking} onPress={this.handleProductRating}>
                  <View style={styles.star}>
                  {[1,2,3,4,5].map((i, index) => 
                      <FontAwesomeIcon key={index} name='star' size={dynamicSize(20)} color={i <= Math.floor(product.rating_summary / 20) ? Colors.red : '#d5d4d4'} />)}
                  </View>
                  <Text style={styles.redLabel}>{product.rating_count} {i18n.t(product.rating_count > 1 ? 'Reviews' : 'Review')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.comBtn} onPress={this.handleProductComment}>
                  <FontAwesomeIcon name='comment' size={dynamicSize(20)} color={Colors.red}/>
                  <Text style={styles.redLabel}>{i18n.t('Comments')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.shareBox}>
                <Text style={styles.redLabel}>{i18n.t('Share')}</Text>
                <View style={styles.shareBtns}>
                  <TouchableOpacity style={[styles.shareBtn, {backgroundColor: '#3A589B'}]} onPress={this.clickShare1}>
                    <FontAwesomeIcon name='facebook' size={dynamicSize(20)} color='white'/>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.shareBtn, {backgroundColor: '#189D0E'}]} onPress={this.clickShare2}>
                    <Icon name='whatsapp' size={dynamicSize(20)} color='white'/>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.shareBtn, {backgroundColor: '#6F3FAA'}]} onPress={this.clickShare3}>
                    <Icon name='viber' size={dynamicSize(20)} color='white'/>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.shareBtn, {backgroundColor: '#0084FF'}]} onPress={this.clickShare4}>
                    <Icon name='facebook-messenger' size={dynamicSize(20)} color='white'/>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.shareBtn, {backgroundColor: '#0084FF'}]} onPress={this.clickShare5}>
                    <Icon name='sms' size={dynamicSize(20)} color='white'/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {product.storeInfo && <View style={styles.infoItem}>
              <Text style={styles.itemTitle}>{i18n.t('Store')}</Text>
              <View style={styles.storeBody}>
                <View style={styles.storeInfo}>
                  <View style={styles.rowStyle}>
                      <FallbackImage style={styles.storeLogo} source={product.storeInfo.seller_pic}/>
                      <TouchableOpacity style={{marginLeft: 10}} onPress={this.clickStore}>
                        <View style={styles.rowStyle}>
                          {product.storeInfo.badge_image_url && <FallbackImage style={styles.storeBadge} source={product.storeInfo.badge_image_url}/>}
                          <Text style={styles.storeName}>{this.strlimit(product.storeInfo)}</Text>
                        </View>
                        <View style={styles.star}>
                          {[1,2,3,4,5].map((i, index) => 
                            <FontAwesomeIcon key={'star'+index} name='star' size={dynamicSize(16)} color={i <= product.storeInfo.store_rating ? Colors.red : '#d5d4d4'} />)}
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.rowStyle}>
                    <Icon name='map-marker' size={dynamicSize(16)} color={Colors.black}/>
                    <Text style={styles.label}>{product.storeInfo.city || ' NA'}</Text>
                  </View>
                </View>
                <View style={[styles.rowStyle, styles.storeCntBox]}>
                  <View>
                    <View style={{flex: 1, alignSelf: 'flex-end', paddingVertical: dynamicSize(10), alignItems: 'center'}}>
                      <Text style={styles.label}>{product.storeInfo.productcount}</Text>
                      <Text style={styles.label}>{i18n.t('Products')}</Text>
                    </View>
                    <TouchableOpacity style={styles.chatSeller} onPress={() => this.clickContact(sellerUniqueId)}>
                      <FontAwesomeIcon name='envelope' size={dynamicSize(13)} color='gray'/>
                      <Text style={styles.chatSellerLabel}>{i18n.t('Chat Seller')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={{flex: 1, width: dynamicSize(130), alignSelf: 'flex-start', paddingVertical: dynamicSize(10), alignItems: 'center', borderLeftWidth: 1, borderColor: Colors.borderColor}}>
                      <Text style={styles.label}>{product.storeInfo.follower}</Text>
                      <Text style={styles.label}>{i18n.t('Followers')}</Text>
                    </View>
                    {product.is_following == 0 ? <TouchableOpacity style={styles.followeBtn} onPress={this.follow}>
                      <Icon name='plus' size={dynamicSize(13)} color='white'/>
                      <Text style={styles.followeBtnLabel}>{i18n.t('Follow')}</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.followeBtn} onPress={this.unfollow}>
                      <Text style={styles.followeBtnLabel}>{i18n.t('Following')}</Text>
                    </TouchableOpacity>}
                  </View>
                </View>
              </View>
            </View>}
            <View style={styles.infoItem}>
              <Text style={{...styles.label, textAlign: 'left'}}>{i18n.t('Product Information')}</Text>
              <View style={styles.productState}>
                <View style={{alignItems: 'center'}}>
                  <Image style={styles.productStateImg} source={require('../assets/img/view1.png')}/>
                  <Text style={styles.productStateTxt}>{i18n.t('Viewed')}</Text>
                  <Text style={styles.productStateTxt}>{product.viewed}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Image style={styles.productStateImg} source={require('../assets/img/heart2.png')}/>
                  <Text style={styles.productStateTxt}>{i18n.t('Saved')}</Text>
                  <Text style={styles.productStateTxt}>{product.wishlist_count}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Image style={styles.productStateImg} source={require('../assets/img/shopping-basket.png')}/>
                  <Text style={styles.productStateTxt}>{i18n.t('Sold')}</Text>
                  <Text style={styles.productStateTxt}>{product.sold}</Text>
                </View>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.label}>{i18n.t('Condition')}</Text>
                <Text style={styles.label}>{
                  (skuProduct.custom_attributes && 
                    skuProduct.custom_attributes[this.conditionIndex()] &&
                    skuProduct.custom_attributes[this.conditionIndex()].value == 9)
                    ? i18n.t('New')
                    : i18n.t('Old')
                }</Text>
              </View>
              <View style={styles.listItem2}>
                <Text style={styles.label}>{i18n.t('Min_Order')}</Text>
                <Text style={styles.label}>{
                  skuProduct.extension_attributes
                  ? skuProduct.extension_attributes.stock_item.min_sale_qty
                  : ''
                } {i18n.t('Item Count')}</Text>
              </View>
              <View style={styles.listItem2}>
                <Text style={styles.label}>{i18n.t('Category')}</Text>
                <View style={styles.catList}>
                  {product.catlist && product.catlist.length > 0 && product.catlist[product.catlist.length - 1].map((cat, catIndex) => {
                      return catIndex != 0 ?
                      <TouchableOpacity
                        key={catIndex}
                        style={styles.catItem}
                        onPress={() => this.clickCatItem(cat.value)}  
                      >
                        <Text style={styles.catItemTxt}>{cat.label}</Text>
                        <Icon name='angle-right' size={dynamicSize(12)} color={Colors.red} onPress={() => this.clickCatItem(cat.value)}/>
                      </TouchableOpacity> : null
                    })}
                </View>
              </View>
            </View>

            {/*<!-- Variation -->*/}
            {skuOfProduct.extension_attributes?.configurable_product_options &&
            <TouchableOpacity style={[styles.infoItem, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]} onPress={this.onClickVariations}>
              <Text style={styles.label}>{i18n.t('select_variations')} <Text style={{color: 'gray'}}>( e.g. {i18n.t('Size')}, {i18n.t('Color')} )</Text></Text>
              <Icon style={{marginRight: dynamicSize(10)}} name='angle-right' size={dynamicSize(14)} color={Colors.red} />
            </TouchableOpacity>}
            <View style={styles.infoItem}>
              <Text style={{...styles.label, textAlign: 'left'}}>{i18n.t('Product Description')}</Text>
              {skuProduct.custom_attributes &&
              <HTMLView
                style={styles.description}
                value={skuProduct.custom_attributes
                  ? skuProduct.custom_attributes[this.descriptionIndex()].value.replace(/\<\/p\>|\<p\>/g, '')
                  : ''} />}
            </View>
            <ProductComment
              handleIsNotLoggedIn={this.handleIsNotLoggedIn}
              handleProductComment={this.handleProductComment}
            />
            <View style={styles.infoItem}>
              <Text style={styles.itemTitle}>{i18n.t('merchant_products')}</Text>
              <ProductsCarousel navigation={navigation} products={merchantProducts} />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.itemTitle}>{i18n.t('similar_products')}</Text>
              <ProductsCarousel navigation={navigation} products={merchantProductsSimiler} />
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.storeBtn} onPress={this.clickStore}>
              <Image style={styles.btnImg} source={require('../assets/img/my-store.png')}/>
              <Text style={styles.btnLabel}>{i18n.t('Store')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeBtn} onPress={() => this.clickContact(sellerUniqueId)}>
              <Image style={styles.btnChatImg} source={require('../assets/img/chat.png')}/>
              <Text style={styles.btnLabel}>{i18n.t('Chat')}</Text>
            </TouchableOpacity>
            {skuProduct.status == 1 ?
            <TouchableOpacity style={styles.addCartBtn} onPress={this.addCart}>
              <Text style={styles.btnLabel2}>{i18n.t('Add to Cart')}</Text>
            </TouchableOpacity>:
            <TouchableOpacity style={styles.addCartBtn} disabled={true} >
              <Text style={styles.btnLabel2}>{i18n.t('Unapproved')}</Text>
            </TouchableOpacity>
            }
          </View>
          <LoadingComponent visible={isLoading}/>
          <Modal
            animationType="fade"
            transparent={true}
            visible={showAlert}
            onRequestClose={() => {
          }}>
            <View style={styles.container}>
              <View style={styles.alertView}>
                <Text style={styles.alertLabel}>{'Added to Cart.'}</Text>
                <FontAwesomeIcon style={styles.alertClose} name='close' size={dynamicSize(20)} color='white' onPress={() => this.setState({showAlert: false})}/>
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
    backgroundColor: '#EFEFEF',
  },
  infoItem: {
    paddingVertical: dynamicSize(10),
    marginBottom: dynamicSize(10),
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  productSlider: {
    width: '100%',
    height: dynamicSize(400),
  },
  toggleBack: {
    position: 'absolute',
    top: dynamicSize(20),
    left: dynamicSize(20),
  },
  toggleCart: {
    position: 'absolute',
    top: dynamicSize(20),
    right: dynamicSize(20),
  },
  toggleWith: {
    position: 'absolute',
    top: dynamicSize(370),
    right: dynamicSize(20),
  },
  nameBox: {
    padding: dynamicSize(10),
    paddingBottom: dynamicSize(20),
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: dynamicSize(16),
    color: '#212529',
  },
  redLabel: {
    fontSize: dynamicSize(14),
    color: Colors.red,
  },
  rankingCom: {
    flexDirection: 'row',
  },
  ranking: {
    flex: 1,
    paddingVertical: dynamicSize(10),
    alignItems: 'center',
  },
  comBtn: {
    flex: 1,
    paddingVertical: dynamicSize(10),
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderLeftWidth: 1,
  },
  star: {
    flexDirection: 'row',
  },
  shareBox: {
    paddingHorizontal: dynamicSize(20),
    paddingTop: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
  shareBtns: {
    flexDirection: 'row',
  },
  shareBtn: {
    marginLeft: 5,
    width: dynamicSize(30),
    height: dynamicSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfoItem: {
    marginBottom: dynamicSize(10),
    padding: dynamicSize(10),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.borderColor,
  },
  itemTitle: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(16),
    fontWeight: 'bold',
    color: Colors.black,
  },
  label: {
    paddingHorizontal: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.black,
    textAlign: 'center',
  },
  rowStyle: {
    paddingVertical: dynamicSize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeBody: {
    paddingHorizontal: dynamicSize(10),
    paddingBottom: dynamicSize(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storeLogo: {
    width: dynamicSize(50),
    height: dynamicSize(50),
    resizeMode: 'contain',
  },
  storeBadge: {
    marginRight: dynamicSize(5),
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
  },
  storeName: {
    fontSize: dynamicSize(14),
    fontWeight: 'bold',
    color: Colors.red,
  },
  storeCntBox: {
    position: 'absolute',
    bottom: 0,
    right: dynamicSize(5),
    marginRight: dynamicSize(5),
    width: dynamicSize(220),
  },
  chatSeller: {
    width: dynamicSize(100),
    padding: dynamicSize(5),
    marginRight: dynamicSize(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRadius: 8,
    borderWidth: 1,
  },
  chatSellerLabel: {
    marginLeft: 5,
    fontSize: 12,
    color: 'gray',
  },
  followeBtn: {
    width: dynamicSize(100),
    padding: dynamicSize(5),
    marginLeft: dynamicSize(5),
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
    fontSize: dynamicSize(12),
    color: 'white',
  },
  productState: {
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(30),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  productStateImg: {
    marginVertical: dynamicSize(10),
    width: dynamicSize(35),
    height: dynamicSize(20),
    resizeMode: 'contain',
  },
  productStateTxt: {
    lineHeight: dynamicSize(20),
    fontSize: dynamicSize(14),
    color: '#757575',
  },
  listItem: {
    paddingVertical: dynamicSize(10),
    marginHorizontal: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  listItem2: {
    padding: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catList: {
    width: '70%',
    paddingRight: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catItemTxt: {
    paddingLeft: dynamicSize(5),
    paddingRight: 2,
    fontSize: dynamicSize(12),
    color: Colors.red,
  },
  description: {
    padding: dynamicSize(10),
  },
  bottomBar: {
    paddingVertical: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  storeBtn: {
    alignItems: 'center',
  },
  btnImg: {
    width: dynamicSize(25),
    height: dynamicSize(25),
  },
  btnChatImg: {
    width: dynamicSize(22),
    height: dynamicSize(22),
  },
  btnLabel: {
      fontSize: dynamicSize(14),
      fontWeight: 'bold',
      color: Colors.red,
  },
  addCartBtn: {
    paddingVertical: dynamicSize(13),
    paddingHorizontal: dynamicSize(35),
    backgroundColor: Colors.red,
  },
  btnLabel2: {
      fontSize: dynamicSize(14),
      fontWeight: 'bold',
      color: 'white',
  },
  alertView: {
    marginTop: dynamicSize(20),
    width: '80%',
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  alertLabel: {
    fontSize: dynamicSize(15),
    fontWeight: 'bold',
    color: 'white',
  },
  alertClose: {
    position: 'absolute',
    right: dynamicSize(15),
  },
});

const mapStateToProps = ({ auth, user, cart, product }) => ({
  isAdminLogged: auth.isAdminLogged,
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  quote: cart.quote,
  addToCartItemState: cart.addToCartItemState,
  product: product.product[0] ? product.product[0] : {},
  carts: product.carts,
  skuProduct: product.skuProduct,
  wishlistProductIdList: product.wishlistProductIdList,
  sellerProducts: product.sellerProducts,
  merchantProducts: product.merchantProducts,
  merchantProductsSimiler: product.merchantProductsSimiler,
  productError: product.productError,
  productCommentList: product.productCommentList,
  productRatingList: product.productRatingList,
  skuOfProduct: product.skuOfProduct,
  sellerUniqueId: product.sellerUniqueId,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  resetProductError,
  fetchProduct,
  fetchMerchantProductsSimiler,
  fetchSkuOfProduct,
  fetchProductWithSku,
  fetchProductCommentList,
  fetchRatingList,
  fetchSellerUniqueId,
  fetchCarts,
  fetchSellerProducts,
  fetchStoreSellerProducts,
  showProductComment,
  handleRemoveFromWishList,
  fetchWishlists,
  addToCartItem,
  fetchQuote,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductShow);