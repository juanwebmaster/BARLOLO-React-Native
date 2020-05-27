import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  fetchCatItemsHot,
  fetchCatProducts,
  clearCatItems,
  fetchCatFilters,
  fetchCatSorts,
} from '../store/actions/category';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';
import ProductsCard from '../components/ProductsCard';
import ProductsListCard from '../components/ProductsListCard';
import CatTabBar from '../components/CatTabBar';

import Filter from './Filter';
import Sort from './Sort';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class CarouselItem extends React.Component {
  
  clickCatItem = (pramas) => {
    const id = pramas[0].value;
    this.props.navigation.goBack();
    this.props.navigation.navigate('HotList', {id});
  }

  render() {
    const {text, pramas} = this.props.data;
    const {active} = this.props;
    return (
      <TouchableOpacity onPress={() => this.clickCatItem(pramas)}>
        <View style={[styles.catTabItem, active == pramas[0].value && styles.active]}>
          <Text style={styles.catText}>{text && text.replace('&amp;', '&')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class HotList extends React.Component {
  constructor(props) {
    super(props);
    
    const { navigation } = this.props;
    this.state = {
      isLoading: false,
      loading: false,
      refreshing: false,
      showFilterPopup: false,
      showSortPopup: false,
      viewType: 'grid',
      selectedCatFilters: [],
      catSort: { name: 'created_at', direction: 'desc' },
      price: [0, 0],
      catId: '',
    };

    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      const {params} = state;
      const catId = params?.id;
      const activeIndex = this.getIndex(catId);
      this.setState({
        isLoading: true,
        loading: false,
        refreshing: false,
        showFilterPopup: false,
        showSortPopup: false,
        viewType: 'grid',
        selectedCatFilters: [],
        catSort: { name: 'created_at', direction: 'desc' },
        price: [0, 0],
        catId,
      });
      const storeId = this.props.lang == 'mm' ? 3 : 1;
      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        this.props.clearCatItems(),
        this.props.fetchCatFilters({storeId, catId}),
        this.props.fetchCatSorts({storeId, catId}),
      ]).then(() => {
        this._carousel.snapToItem(activeIndex);
        this.handleRefresh();
        this.setState({isLoading: false});
      })
      .catch(error => {
        console.log(error)
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  handleLoadMore = () => {
    const {isLogged, lang, user, pageNo, productTotal} = this.props;
    const {loading, catId} = this.state;
    if(!loading && pageNo * 30 < productTotal) {
        this.setState({loading: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchCatItemsHot({
          catId,
          pageSize: 30,
          pageNo: parseInt(pageNo) + 1,
          price: this.state.price,
          catFilters: this.state.selectedCatFilters,
          catSort: this.state.catSort,
        }).then(() => {
        this.props.fetchCatProducts({
          storeId,
          customerId: isLogged ? user.id : 0,
          productIdList: this.props.catItemsHot,
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
    const {isLogged, lang, user} = this.props;
    const {refreshing, catId} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchCatItemsHot({
          catId,
          pageSize: 30,
          pageNo: 1,
          price: this.state.price,
          catFilters: this.state.selectedCatFilters,
          catSort: this.state.catSort,
        }).then(() => {
        this.props.fetchCatProducts({
          storeId,
          customerId: isLogged ? user.id : 0,
          productIdList: this.props.catItemsHot,
          pageNo: 1,
        })
        .then(res => {
            this.scroll.scrollToOffset({offset: 0});
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

  getIndex = (value) => {
    let index = 0;
    this.props.hotlists.forEach((hotlist, i) => {
      if (hotlist.pramas && hotlist.pramas[0] && hotlist.pramas[0].value == value)
        index = i;
    })
    return index;
  }

  _moveToNext = () => {
      this._carousel.snapToNext();
  }

  _moveToPrev = () => {
      this._carousel.snapToPrev();
  }

  _renderItem = ({item, index}) => {
    return (this.state.viewType == 'grid' ?
      <ProductsCard
          key={index}
          data={item}
          navigation={this.props.navigation}
          style={index % 2 ? {borderLeftWidth: 0} : null}
      /> :
      <ProductsListCard
          key={index}
          data={item}
          navigation={this.props.navigation}
      />
    );
  }

  render() {
    const {isLoading, refreshing, showSortPopup, showFilterPopup, viewType, price, selectedCatFilters, catId} = this.state;
    const {navigation, hotlists, catProducts} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Hot List')} isCartBtn={true}/>
          <View style={styles.slider}>
              <Carousel
                key={'HotListCarousel'}
                ref={(c) => { this._carousel = c; }}
                data={hotlists}
                renderItem={({item, index}) => <CarouselItem key={index} data={item} active={catId} navigation={navigation} />}
                sliderWidth={SCREEN_WIDTH}
                itemWidth={SCREEN_WIDTH/2}
                loop={true}
                activeSlideAlignment='start'
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
              />
              <View style={styles.snapBtnBox}>
                  <TouchableOpacity style={styles.snapBtn} onPress={this._moveToPrev}>
                      <Icon name='angle-left' size={dynamicSize(20)} color={'rgba(0, 0, 0, 0.75)'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.snapBtn} onPress={this._moveToNext}>
                      <Icon name='angle-right' size={dynamicSize(20)} color={'rgba(0, 0, 0, 0.75)'} />
                  </TouchableOpacity>
              </View>
          </View>
          {viewType == 'grid' ? <FlatList
            key='FlatList1'
            ref={ref => this.scroll=ref}
            contentContainerStyle={styles.contentStyle}
            data={catProducts}
            renderItem={this._renderItem}
            ListHeaderComponent={<View style={styles.headerBottom} />}
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
            contentContainerStyle={styles.contentStyle}
            data={catProducts}
            renderItem={this._renderItem}
            ListHeaderComponent={<View style={styles.headerBottom} />}
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
  contentStyle: {
    paddingHorizontal: 10,
  },
  headerBottom: {
    width: SCREEN_WIDTH - 20,
    height: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  active: {
    backgroundColor: '#DFDFDF',
    borderColor: Colors.red,
    borderBottomWidth: 2,
  },
  catTabItem: {
    width: SCREEN_WIDTH/2,
    height: dynamicSize(60),
    paddingHorizontal: dynamicSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  catText: {
    fontSize: dynamicSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.red,
  },
  slider: {
      justifyContent: 'center',
  },
  snapBtnBox: {
      width: '100%',
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  snapBtn: {
      width: dynamicSize(30),
      height: dynamicSize(30),
      justifyContent: 'center',
      alignItems: 'center',
  },
});

const mapStateToProps = ({ auth, user, category, home }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  catFilters: category.catFilters,
  catSorts: category.catSorts,
  catItemsHot: category.catItemsHot,
  catProducts: category.catProducts,
  productTotal: category.productTotal,
  hotlists: home.hotlists,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchCatItemsHot,
  fetchCatProducts,
  clearCatItems,
  fetchCatFilters,
  fetchCatSorts,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HotList);
