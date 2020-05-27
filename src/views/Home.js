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
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {
  fetchCarts,
  fetchHomeBanners,
  fetchSellerBadges,
  fetchRecommendedStores,
  fetchHeaderCategories,
  fetchCategories,
  fetchHotlists,
  fetchSaleProductLists,
  fetchProducts,
} from '../store/actions/home';

import SearchBox from '../components/SearchBox';
import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';
import HomeSlider from '../components/HomeSlider';
import SellerBadges from '../components/SellerBadges';
import RecommendedStores from '../components/RecommendedStores';
import HotListCarousel from '../components/HotListCarousel';
import SaleCarousel from '../components/SaleCarousel';
// import Products from '../components/Products';
import FallbackImage from '../components/FallbackImage';
import ProductsCard from '../components/ProductsCard';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class HomeHeder extends React.Component {

  clickCatItem = (id) => {
    this.props.navigation.navigate('CategoryShow', {id, keyword : ''});
  }

  render() {
    const {navigation, bannerImages, headerCategories, sellerBadges, recommendedStores, hotlists, saleProduct} = this.props;
    return (
      <View style={{width: SCREEN_WIDTH}} removeClippedSubviews={true}>
        <HomeSlider bannerImages={bannerImages} imageType='file'/>
        <SellerBadges navigation={navigation} sellerBadges={_.chunk(sellerBadges, 2)}/>
        <RecommendedStores navigation={navigation} recommendedStores={recommendedStores}/>
        <View style={styles.titleBar} onPress={this.clickViewStore}>
            <Text style={styles.title}>{i18n.t('Category')}</Text>
        </View>
        <View style={styles.catagories}>
          {headerCategories.map((category, index) => {
            return category.categoryDetails && category.categoryDetails.include_in_menu == 1 ?
            <TouchableOpacity key={index} style={styles.catagoryIten} onPress={() => this.clickCatItem(category.categoryDetails.entity_id)}>
              <FallbackImage style={styles.catagoryIcon} source={category.categoryDetails.image_path} />
              <Text style={styles.catagoryLabel}>{category.categoryDetails.name}</Text>
            </TouchableOpacity> : null
          })}
        </View>
        <HotListCarousel navigation={navigation} hotlists={hotlists}/>
        <View style={styles.blank}/>
        <SaleCarousel navigation={navigation} saleProduct={saleProduct}/>
        <View style={styles.blank}/>
        <View style={styles.titleBar} onPress={this.clickViewStore}>
            <Text style={styles.title}>{i18n.t('recent_listing')}</Text>
        </View>
        <View style={styles.headerBottom} />
      </View>
    );
  }
}

class Home extends React.Component {
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
      this.setState({
        isLoading: true,
      });

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {        
        const {isLogged,
          user,
          lang,
          bannerImages,
          sellerBadges,
          recommendedStores,
          categories,
          headerCategories,
          hotlists,
        } = this.props;
        const storeId = lang == 'mm' ? 3 : 1;
        Promise.all([
          this.props.fetchCarts(isLogged ? user.id : 0),
          this.props.fetchHomeBanners(bannerImages),
          this.props.fetchSellerBadges(storeId, [], sellerBadges),
          this.props.fetchRecommendedStores(lang, [], recommendedStores),
          this.props.fetchHeaderCategories(storeId, [], headerCategories),
          this.props.fetchCategories(lang, [], categories),
          this.props.fetchHotlists(storeId,  [], hotlists),
          this.props.fetchSaleProductLists({
            storeId,
            customerId: isLogged ? user.id : 0,
            pageSize: 10,
            pageNo: 1,
          }),
          this.props.fetchProducts({
            storeId,
            customerId: isLogged ? user.id : 0,
            pageSize: 10,
            pageNo: 1,
            cancelSource: {},
          }),
        ]).then(() => {
          this.setState({isLoading: false});
        })
        .catch(error => {
          this.setState({isLoading: false});
        })
      })
      .catch(error => {
        alert(error)
        this.setState({isLoading: false});
      })
    });
  }

  componentDidMount() {
  }
  
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  handleLoadMore = () => {
      const {isLogged, lang, user, pageNo} = this.props;
      const {loading} = this.state;
      if(!loading) {
          this.setState({loading: true});
          const storeId = lang == 'mm' ? 3 : 1;
          this.props.fetchProducts({
              storeId,
              customerId: isLogged ? user.id : 0,
              pageSize: 30,
              pageNo: parseInt(pageNo) + 1,
              cancelSource: {},
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
        this.props.fetchProducts({
            storeId,
            customerId: isLogged ? user.id : 0,
            pageSize: 30,
            pageNo: 1,
            cancelSource: {},
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
          <NavHeader navigation={navigation} isBack={false} isMenuBtn={true} isCartBtn={true}/>
          <FlatList
            // contentContainerStyle={{alignItems: 'center'}}
            data={products}
            renderItem={this._renderItem}
            ListHeaderComponent={<HomeHeder {...this.props}/>}
            ListFooterComponent={this._renderFooter}
            keyExtractor={item => item.entity_id}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndThreshold={0}
            numColumns={2}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          />
          <SearchBox navigation={navigation} />
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
    borderTopWidth: 2,
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
  catagories: {
    width: '100%',
    borderColor: Colors.borderColor,
    borderLeftWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catagoryIten: {
    paddingVertical: dynamicSize(12),
    paddingHorizontal: dynamicSize(10),
    width: SCREEN_WIDTH/2-1,
    height: dynamicSize(55),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  catagoryIcon: {
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  catagoryLabel: {
    flex: 1,
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.black,
  }
});

const mapStateToProps = ({ auth, user, home }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  bannerImages: home.bannerImages,
  sellerBadges: home.sellerBadges,
  recommendedStores: home.recommendedStores,
  categories: home.categories,
  headerCategories: home.headerCategories,
  hotlists: home.hotlists,
  saleProduct: home.saleProduct,
  products: home.products,
  pageNo: home.productPageNo,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  fetchCarts,
  fetchHomeBanners,
  fetchSellerBadges,
  fetchRecommendedStores,
  fetchHeaderCategories,
  fetchCategories,
  fetchHotlists,
  fetchSaleProductLists,
  fetchProducts,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);