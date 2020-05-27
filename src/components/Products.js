import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import ProductsCard from './ProductsCard';

import i18n from "@app/locale/i18n";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';
import Colors from '@app/config/colors';

import {fetchProducts} from '../store/actions/home';

class Products extends React.Component {
    state = {
        loading: false,
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

    handleLoadMore = () => {
        const {isLogged, lang, user, pageNo} = this.props;
        const {loading} = this.state;
        if(!loading) {
            this.setState({loading: true});
            const storeId = lang == 'mm' ? 3 : 1;
            this.props.fetchProducts({
                storeId,
                customerId: isLogged ? user.id : 0,
                pageSize: 10,
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

    render () {
        return (
            <View style={styles.container}>
                <FlatList
                    key={'Products'}
                    style={styles.list}
                    data={this.props.products}
                    renderItem={this._renderItem}
                    // ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    keyExtractor={item => item.entity_id}
                    // refreshing={this.state.loading}
                    onRefresh={this.handleRefresh}
                    onEndReached={this.handleLoadMore}
                    onEndThreshold={0}
                    numColumns={2}
                    nestedScrollEnabled={true}
                    removeClippedSubviews={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxHeight: SCREEN_HEIGHT,
        alignItems: 'center',
    },
    list: {
        marginTop: 10,
        borderColor: 'gray',
        borderTopWidth: 1,
    },
  });

  const mapStateToProps = ({ auth, user, home }) => ({
    isLogged: auth.isLogged,
    lang: user.lang,
    user: auth.user,
    products: home.products,
    pageNo: home.productPageNo,
  });
  
  const mapDispatchToProps = {
    fetchProducts,
  };
  
  module.exports = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Products);