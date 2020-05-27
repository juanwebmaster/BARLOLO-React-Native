import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import LoadingComponent from '../components/LoadingComponent';

import {fetchSearchResults, clearSearchResults} from '../store/actions/home';

class SearchBox extends React.Component {
  constructor() {
    super();
    this.state = {
      searchWord: '',
      showSearch: false,
      isLoading: false,
    };
    this.cancelSource=null;
  }

  searchProducts(onlypro = 0) {
    const {searchWord} = this.state;
    if (searchWord.length > 3) {
      if (this.cancelSource) {
        this.cancelSource.cancel('Start new search, stop active search')
      }
      this.setState({isLoading: true});
      this.cancelSource = axios.CancelToken.source();
      this.props.fetchSearchResults({
        keyWord: searchWord,
        onlyproduct: onlypro,
        timeout: 5000,
        cancelSource: this.cancelSource
      })
      .then(() => {
        this.setState({showSearch: true, isLoading: false});
      })
      .catch(error => {
        console.log(error.message);
        if(error.message != "Cannot read property 'status' of undefined") {
          // this.setState({isLoading: false});
        }
      })
    } else {
      this.props.clearSearchResults();
      this.setState({showSearch: false, isLoading: false});
    }
  }

  clickCatItem = (item) => {
    this.setState({showSearch: false, searchWord: ''});
    const {navigation} = this.props;
    if(navigation.state.routeName === 'CategoryShow')
        navigation.goBack();
    navigation.navigate('CategoryShow', {id: item.id, keyword: this.state.searchWord});
  }

  renderCategories(data) {
    if(!data.length) return null;
    return (
      <View style={styles.resultItem}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{i18n.t('CATEGORIES')}</Text>
        </View>
        {data.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem} onPress={() => this.clickCatItem(item)}>
            <View >
              <Text style={styles.categoryTxt1}>{this.state.searchWord}<Text style={styles.categoryTxt2}> in</Text></Text>
              <Text style={styles.categoryTxt3}>{item.cat_name}</Text>
            </View>
            <Text style={styles.categoryTxt4}>{item.count} RESULTS</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  clickProduct = (item) => {
    this.setState({showSearch: false, searchWord: ''});
    const {navigation} = this.props;
    console.log(item)
    navigation.navigate('ProductShow', {id: item.id, sku: item.sku});
  }

  renderPopular(data) {
    if(!data.length) return null;
    return (
      <View style={styles.resultItem}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{'MOST POPULAR'}</Text>
        </View>
        {data.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem} onPress={() => this.clickProduct(item)}>
            <Text style={styles.popularTxt}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  clickStoreItem = (item) => {
    this.setState({showSearch: false, searchWord: ''});
    const {navigation} = this.props;
    if(navigation.state.routeName === 'StoreShow')
        navigation.goBack();
    navigation.navigate('StoreShow', {id: item.seller_id});
  }

  renderStores(data) {
    if(!data.length) return null;
    return (
      <View style={styles.resultItem}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{'STORES'}</Text>
        </View>
        {data.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem} onPress={() => this.clickStoreItem(item)}>
            <Image style={styles.badge} source={item.badge_image_url?{uri: item.badge_image_url} : require('../assets/img/my-store.png')}/>
            <Text style={styles.popularTxt}>{item.shop_title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  clickPopCount = () => {
    this.setState({showSearch: false, searchWord: ''});
    const {navigation} = this.props;
    if(navigation.state.routeName === 'SearchProducts')
        navigation.goBack();
    navigation.navigate('SearchProducts', {keyword: this.state.searchWord});
  }

  renderPopularCount(data) {
    if(!data) return null;
    return (
      <View style={styles.resultItem}>
        <TouchableOpacity style={styles.titleBar} onPress={this.clickPopCount}>
          <Text style={styles.title}>{data}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {navigation, searchresults} = this.props;
    const {searchWord, showSearch, isLoading} = this.state;
    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled = {Platform.OS === 'ios' ? true : false}
        >
          <TouchableOpacity style={styles.inputContainer} onPress={() => this.setState({showSearch: !showSearch})}>
            <Icon name='search' size={dynamicSize(16)} color='gray' />
            <TextInput
              style={styles.textInput}
              placeholder={i18n.t('main_search')}
              placeholderTextColor={Colors.placeholder}
              autoCapitalize="none"
              onChangeText={(text) => this.setState({ searchWord: text}, () => this.searchProducts(0))}
              // onBlur={() => this.searchProducts(0)}
              value={searchWord}
              underlineColorAndroid="transparent"
            />
            {(searchWord != '') && <FontAwesomeIcon name='close' size={dynamicSize(16)} color='gray' onPress={() => this.setState({showSearch: false, searchWord: '', isLoading: false}, this.props.clearSearchResults)} />}
          </TouchableOpacity>
          {(showSearch && searchresults.success) && <ScrollView style={styles.result} removeClippedSubviews={true}>
            {this.renderCategories(searchresults.success.category)}
            {this.renderStores(searchresults.success.seller)}
            {this.renderPopular(searchresults.success.most_popular)}
            {this.renderPopularCount(searchresults.success.most_popular_count)}
          </ScrollView>}
          {/* <LoadingComponent visible={isLoading}/> */}
          {isLoading && <View style={styles.loading}>
            <ActivityIndicator/>
          </View>}
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: dynamicSize(5),
    width: '75%',
    alignSelf: 'center',
  },
  inputContainer: {
    paddingHorizontal: dynamicSize(10),
    width: '100%',
    height: dynamicSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  textInput: {
    flex: 1,
    marginHorizontal: dynamicSize(10),
    height: dynamicSize(48),
    fontSize: dynamicSize(12),
    color: Colors.black,
  },
  loading: {
    marginTop: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  result: {
    marginTop: 5,
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  titleBar: {
    padding: dynamicSize(10),
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#d6d6d6',
  },
  title: {
    fontSize: dynamicSize(14),
    color: Colors.black
  },
  listItem: {
    padding: dynamicSize(10),
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  categoryTxt1: {
    fontSize: dynamicSize(12),
    fontWeight: 'bold',
    color: Colors.black,
  },
  categoryTxt2: {
    fontSize: dynamicSize(12),
    fontWeight: '100',
    color: Colors.black,
  },
  categoryTxt3: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  categoryTxt4: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontSize: dynamicSize(13),
    color: '#929292',
  },
  popularTxt: {
    flex: 1,
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  badge: {
    marginLeft: dynamicSize(10),
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
  }
});

const mapStateToProps = ({ home, user }) => ({
  lang: user.lang,
  searchresults: home.searchresults,
});

const mapDispatchToProps = {
  fetchSearchResults,
  clearSearchResults,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBox);