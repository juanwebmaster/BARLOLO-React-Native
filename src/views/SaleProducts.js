import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import ProductsCard from '../components/ProductsCard';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, dynamicSize} from '../config';

import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {fetchSaleProductLists} from '../store/actions/home';

class SaleProducts extends React.Component {
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
        loading: false,
        refreshing: false,
      });
      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        this.handleRefresh();
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

  renderFooter = () => {
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

  handleRefresh = () => {
    const {isLogged, lang, user, pageNo} = this.props;
    const {refreshing} = this.state;
    if(!refreshing) {
        this.setState({refreshing: true});
        const storeId = lang == 'mm' ? 3 : 1;
        this.props.fetchSaleProductLists({
            storeId,
            customerId: isLogged ? user.id : 0,
            pageNo: 1,
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

  handleLoadMore = () => {
      const {isLogged, lang, user, pageNo} = this.props;
      const {loading} = this.state;
      if(!loading) {
          this.setState({loading: true});
          const storeId = lang == 'mm' ? 3 : 1;
          this.props.fetchSaleProductLists({
              storeId,
              customerId: isLogged ? user.id : 0,
              pageNo: parseInt(pageNo) + 1,
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

  render () {
    const {navigation, products} = this.props;
    const {isLoading, refreshing} = this.state;
      return (
        <Fragment>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.container}>
            <NavHeader navigation={navigation} title={i18n.t('Sale Product')} isCartBtn={true}/>
            <FlatList
                key={'Products'}
                contentContainerStyle={styles.contentStyle}
                data={products}
                renderItem={this._renderItem}
                // ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={<View style={styles.headerBottom} />}
                ListFooterComponent={this.renderFooter}
                keyExtractor={item => item.entity_id}
                refreshing={refreshing}
                onRefresh={this.handleRefresh}
                onEndReached={this.handleLoadMore}
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
    paddingHorizontal: 10,
  },
  headerBottom: {
    width: SCREEN_WIDTH - 20,
    height: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
});

const mapStateToProps = ({ auth, user, home }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  products: home.saleProduct,
  pageNo: home.saleProductPageNo,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  fetchSaleProductLists,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaleProducts);