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
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {
  fetchBannerImages,
  fetchSellerBadges,
  fetchRecommendedStores,
  fetchPopularSubcategories,
  fetchCatFilters,
  fetchCatSorts,
  fetchCatDetail,
  fetchCatItems,
  fetchCatProducts,
  clearCatItems,
} from '../store/actions/category';

import SearchBox from '../components/SearchBox';
import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';
import HomeSlider from '../components/HomeSlider';
import SellerBadges from '../components/SellerBadges';
import RecommendedStores from '../components/RecommendedStores';
import SubCatCarousel from '../components/SubCatCarousel';
import ProductsCard from '../components/ProductsCard';
import ProductsListCard from '../components/ProductsListCard';
import CatTabBar from '../components/CatTabBar';

import Filter from './Filter';
import Sort from './Sort';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class ListHeder extends React.Component {

  render() {
    const {navigation, bannerImages, sellerBadges, recommendedStores, popularSubcategories, selectedCatFilters, deletefilteritem} = this.props;
    return (
      <View style={{width: SCREEN_WIDTH}} removeClippedSubviews={true}>
        <HomeSlider bannerImages={bannerImages} imageType='file'/>
        <SellerBadges navigation={navigation} sellerBadges={_.chunk(sellerBadges, 2)}/>
        <RecommendedStores navigation={navigation} recommendedStores={recommendedStores}/>
        <SubCatCarousel navigation={navigation} subcategories={popularSubcategories.items}/>
        {selectedCatFilters.length > 0 && <Text style={styles.filterTitle}>{'Now Shopping By'}</Text>}
        {selectedCatFilters.length > 0 && <View style={styles.filterBox}>
          {selectedCatFilters.map((filter, index) => (
            <View key={index} style={styles.filterItem}>
              <Text style={styles.filterTxt}>{filter.name}: <Text style={{fontSize: 14}}>{filter.label}</Text></Text>
              <Icon name='close' size={dynamicSize(16)} color={Colors.red} onPress={() => deletefilteritem(filter.name)}/>
            </View>
          ))}
        </View>}
        <View style={styles.headerBottom} />
      </View>
    );
  }
}

class CategoryShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      loading: false,
      refreshing: false,
      keyword: '',
      showFilterPopup: false,
      showSortPopup: false,
      viewType: 'grid',
      selectedCatFilters: [],
      catSort: { name: 'created_at', direction: 'desc' },
      price: [0, 0]
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      
      const {routeName, params} = state;

      this.setState({
        isLoading: true,
        loading: false,
        refreshing: false,
        keyword: params?.keyword ? params.keyword : '',
        showFilterPopup: false,
        showSortPopup: false,
        viewType: 'grid',
        selectedCatFilters: [],
        catSort: { name: 'created_at', direction: 'desc' },
        price: [0, 0]
      });

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.clearCatItems(),
      ]).then(() => {
        const {
          isLogged,
          user,
          lang,
        } = this.props;

        const catId = params.id;
        const storeId = lang == 'mm' ? 3 : 1;
        Promise.all([
          this.props.fetchBannerImages({storeId, catId}),
          this.props.fetchSellerBadges({storeId, catId}),
          this.props.fetchRecommendedStores({storeId, catId}),
          this.props.fetchPopularSubcategories(lang, catId),
          this.props.fetchCatFilters({storeId, catId}),
          this.props.fetchCatSorts({storeId, catId}),
          this.props.fetchCatDetail(catId),
          this.props.fetchCatItems({
            catId,
            pageSize: 30,
            pageNo: 1,
            price: this.state.price,
            catFilters: this.state.selectedCatFilters,
            catSort: this.state.catSort,
            searchKeyword : params?.keyword ? params.keyword : '',
          }),
        ]).then(() => {
          this.props.fetchCatProducts({
            storeId,
            customerId: user.id || 0,
            productIdList: this.props.catItems,
            pageNo: 1,
          })
          this.scroll.scrollToOffset({offset: 0});
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
      const {isLogged, lang, user, pageNo, productTotal, navigation} = this.props;
      const {loading} = this.state;
      if(!loading && pageNo * 30 < productTotal) {
          this.setState({loading: true});
          const catId = navigation.state.params.id;
          const storeId = lang == 'mm' ? 3 : 1;
          this.props.fetchCatItems({
            catId,
            pageSize: 30,
            pageNo: parseInt(pageNo) + 1,
            price: this.state.price,
            catFilters: this.state.selectedCatFilters,
            catSort: this.state.catSort,
            searchKeyword : this.state.keyword
          }).then(() => {
          this.props.fetchCatProducts({
            storeId,
            customerId: isLogged ? user.id : 0,
            productIdList: this.props.catItems,
            pageNo: parseInt(pageNo) + 1,
          })
          .then(res => {
              this.setState({loading: false});
          })
          .catch(error => {
              console.log(error);
              this.setState({loading: false});
          })
        })
        .catch(error => {
          console.log(error);
          this.setState({loading: false});
        })
      }
  }

  handleRefresh = () => {
    const {isLogged, lang, user, navigation} = this.props;
    const {refreshing} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const catId = navigation.state.params.id;
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchCatItems({
          catId,
          pageSize: 30,
          pageNo: 1,
          price: this.state.price,
          catFilters: this.state.selectedCatFilters,
          catSort: this.state.catSort,
          searchKeyword : this.state.keyword
        }).then(() => {
        this.props.fetchCatProducts({
          storeId,
          customerId: isLogged ? user.id : 0,
          productIdList: this.props.catItems,
          pageNo: 1,
        })
        .then(res => {
            this.setState({refreshing: false});
        })
        .catch(error => {
            console.log(error);
            this.setState({refreshing: false});
        })
      })
      .catch(error => {
        console.log(error);
        this.setState({refreshing: false});
      })
    }
  }

  onSortBy = (catSort) => {
    this.setState({catSort, showSortPopup: false}, this.handleRefresh);
  }

  onFilters = (price, selectedCatFilters) => {
    console.log(price, selectedCatFilters);
    this.setState({price, selectedCatFilters, showFilterPopup: false}, this.handleRefresh);
  }

  deletefilteritem = (name) => {
    const {selectedCatFilters} = this.state;
    this.setState({selectedCatFilters: selectedCatFilters.filter(filter => filter.name != name)}, this.handleRefresh);
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
    return (this.state.viewType == 'grid' ?
      <ProductsCard
          key={index}
          data={item}
          navigation={this.props.navigation}
          style={index % 2 ? {borderLeftWidth: 0} : {marginLeft: 10}}
      /> :
      <ProductsListCard
          key={index}
          data={item}
          navigation={this.props.navigation}
      />
    );
  }

  render() {
    const {isLoading, refreshing, showSortPopup, showFilterPopup, viewType, price, selectedCatFilters} = this.state;
    const {navigation, catProducts} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} isBack={true} isCartBtn={true}/>
          {viewType == 'grid' ? <FlatList
            key='FlatList1'
            ref={ref => this.scroll=ref}
            // contentContainerStyle={{alignItems: 'center'}}
            data={catProducts}
            renderItem={this._renderItem}
            ListHeaderComponent={<ListHeder {...this.props} selectedCatFilters={selectedCatFilters} deletefilteritem={this.deletefilteritem}/>}
            ListFooterComponent={this._renderFooter}
            keyExtractor={(item, index) => item.entity_id+':'+index}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndThreshold={0}
            numColumns={2}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          /> :
          <FlatList
            key='FlatList2'
            ref={ref => this.scroll=ref}
            contentContainerStyle={{alignItems: 'center'}}
            data={catProducts}
            renderItem={this._renderItem}
            ListHeaderComponent={<ListHeder {...this.props} selectedCatFilters={selectedCatFilters} deletefilteritem={this.deletefilteritem}/>}
            ListFooterComponent={this._renderFooter}
            keyExtractor={(item, index) => item.entity_id+':'+index}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndThreshold={0}
            numColumns={1}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          />}
          <CatTabBar
            navigation={navigation}
            setSortBy={()=>this.setState({showSortPopup: true})}
            setfilter={()=>this.setState({showFilterPopup: true})}
            setView={()=>this.setState({viewType: viewType == 'list' ? 'grid' : 'list'})}
            viewType={viewType}/>
          <SearchBox navigation={navigation} />
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSortPopup}
            onRequestClose={() => {
          }}>
            <Sort onSortBy={this.onSortBy} onExit={() => this.setState({showSortPopup: false})}/>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={showFilterPopup}
            onRequestClose={() => {
          }}>
            <Filter
              onFilters={this.onFilters}
              onExit={() => this.setState({showFilterPopup: false})}
              price={price}
              selectedCatFilters={selectedCatFilters}
            />
          </Modal>
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
    height: 15,
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
  filterTitle: {
    paddingVertical: dynamicSize(10),
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(16),
    fontWeight: 'bold',
    color: Colors.black,
  },
  filterBox: {
    paddingHorizontal: dynamicSize(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterItem: {
    padding: dynamicSize(10),
    margin: dynamicSize(5),
    borderRadius: dynamicSize(20),
    flexDirection: 'row',
    backgroundColor: '#6C757D',
    alignItems: 'center',
  },
  filterTxt:{
    marginRight: dynamicSize(10),
    fontSize: dynamicSize(13),
    fontWeight: 'bold',
    color: 'white'
  },
});

const mapStateToProps = ({ auth, user, category }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  bannerImages: category.bannerImages,
  sellerBadges: category.sellerBadges,
  recommendedStores: category.recommendedStores,
  popularSubcategories: category.popularSubcategories,
  catFilters: category.catFilters,
  catSorts: category.catSorts,
  catItems: category.catItems,
  catProducts: category.catProducts,
  pageNo: category.pageNo,
  productTotal: category.productTotal,
  categoryDetail: category.categoryDetail,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  fetchBannerImages,
  fetchSellerBadges,
  fetchRecommendedStores,
  fetchPopularSubcategories,
  fetchCatFilters,
  fetchCatSorts,
  fetchCatDetail,
  fetchCatItems,
  fetchCatProducts,
  clearCatItems,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryShow);