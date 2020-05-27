import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, dynamicSize} from '../config';

import NavHeader from '../components/NavHeader';
import ProductsCard from '../components/ProductsCard';
import LoadingComponent from '../components/LoadingComponent';

import {fetchSearchResults} from '../store/actions/home';


class SaleProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      searchWord: ''
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({
        refreshing: false,
        searchWord: state.params?.keyword,
      }, this.handleRefresh);
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
    const {searchWord} = this.state;
    if (this.cancelSource) {
      this.cancelSource.cancel('Start new search, stop active search')
    }
    this.setState({refreshing: true});
    this.cancelSource = axios.CancelToken.source();
    this.props.fetchSearchResults({
      keyWord: searchWord,
      onlyproduct: 1,
      cancelSource: this.cancelSource
    })
    .then(() => {
      this.setState({refreshing: false});
      this.cancelSource = null;
    })
    .catch(error => {
      console.log(error.message);
      if(error.message != "Cannot read property 'status' of undefined") {
        // this.setState({refreshing: false});
      }
    })
  }

  render () {
    const {navigation, products} = this.props;
    const {refreshing, searchWord} = this.state;
      return (
        <Fragment>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.container}>
            <NavHeader navigation={navigation} title={i18n.t('Sale Product')} isCartBtn={true}/>
            <View style={styles.inputContainer}>
              <Icon name='search' size={dynamicSize(16)} color='gray' />
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('main_search')}
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                onChangeText={(text) => this.setState({ searchWord: text}, this.handleRefresh)}
                value={searchWord}
                underlineColorAndroid="transparent"
              />
              {(searchWord != '') && <FontAwesomeIcon name='close' size={dynamicSize(16)} color='gray' onPress={() => this.setState({searchWord: ''})} />}
            </View>
            <FlatList
                key={'Products'}
                contentContainerStyle={styles.contentStyle}
                data={products}
                ListHeaderComponent={<View style={styles.headerBottom} />}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => item.entity_id+":"+index}
                refreshing={refreshing}
                onRefresh={this.handleRefresh}
                // ListFooterComponent={this.renderFooter}
                // onEndReached={this.handleLoadMore}
                // onEndThreshold={0}
                numColumns={2}
                nestedScrollEnabled={true}
                removeClippedSubviews={true}
            />
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
  inputContainer: {
    position: 'absolute',
    top: dynamicSize(5),
    paddingHorizontal: dynamicSize(10),
    width: '75%',
    height: dynamicSize(40),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    marginHorizontal: dynamicSize(10),
    height: dynamicSize(40),
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  headerBottom: {
    width: SCREEN_WIDTH - 20,
    height: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
});

const mapStateToProps = ({ user, home }) => ({
  lang: user.lang,
  products: home.searchresults.success && home.searchresults.success.most_popular ? Object.keys(home.searchresults.success.most_popular).map(key => home.searchresults.success.most_popular[key]) : [],
});

const mapDispatchToProps = {
  fetchSearchResults,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaleProducts);