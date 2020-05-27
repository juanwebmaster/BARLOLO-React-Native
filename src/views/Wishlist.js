import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchCarts, fetchWishlists, fetchWishlistProducts} from '../store/actions/product';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';
import ProductsCard from '../components/ProductsCard';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';

class Wishlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      isLoading: false,
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

        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.setState({isLoading: false});
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        }

        if(this.props.isLogged) {
          Promise.all([
            this.props.fetchCarts(this.props.user.id),
            this.props.fetchWishlists(this.props.user.id)
          ]).then(res => {
            this.props.fetchWishlistProducts({
              storeId: this.props.lang == 'mm' ? 3 : 1,
              customerId: this.props.user.id,
              productIdList: this.props.wishlistProductIdList
            })
            .then(() => {
              this.setState({isLoading: false})
            })
            .catch(error => {
              console.log(error)
              this.setState({isLoading: false})
            })
          })
          .catch(() => {
            this.setState({isLoading: false})
          })
        }
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

  handleRefresh = () => {
    const {wishlistProductIdList, lang, user} = this.props;
    const {refreshing} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchWishlistProducts({
          storeId,
          customerId: user.id,
          productIdList: wishlistProductIdList
        })
        .then(() => {
          this.setState({refreshing: false})
        })
        .catch(error => {
          console.log(error)
          this.setState({refreshing: false})
        })
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <ProductsCard
        key={index}
        data={item}
        navigation={this.props.navigation}
        style={index % 2 ? {borderLeftWidth: 0} : null}
      />
    );
  }

  render() {
    const {isLoading, refreshing} = this.state;
    const {navigation} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Wishlist')} isCartBtn={true}/>
          <FlatList
            key={'Products'}
            contentContainerStyle={styles.contentStyle}
            data={this.props.wishlistProducts}
            ListHeaderComponent={<View style={styles.headerBottom} />}
            renderItem={this._renderItem}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            keyExtractor={item => item.entity_id}
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
    alignItems: 'center',
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
});

const mapStateToProps = ({ auth, user, product }) => ({
  lang: user.lang,
  isLogged: auth.isLogged,
  user: auth.user,
  carts: product.carts,
  wishlistProductIdList: product.wishlistProductIdList,
  wishlistProducts: product.wishlistProducts,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchCarts,
  fetchWishlists,
  fetchWishlistProducts,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wishlist);