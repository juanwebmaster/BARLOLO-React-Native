import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
// import ReviewForm from './ReviewForm'
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {dynamicSize} from '../config';

class ProductRating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      toggleReviewForm: false,
      ratingCount: 'all',
      users: props.productRatingList,
    };

    const { navigation } = props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({
        isLoading: true,
        toggleReviewForm: false,
        ratingCount: 'all',
        users: this.props.productRatingList,
      });

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        this.setState({isLoading: false});

        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        }

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

  formattedDate(value) {
    return moment(value).format('DD MMM, YYYY')
  }

  handleCancelReviewForm() {
    this.toggleReviewForm = false
  }

  filterReview(value) {
    let users = [];
    if (value == 'all') {
      users = this.props.productRatingList
    } else {
      users = this.props.productRatingList.filter(
        rating => rating.reivew_star == value
      )
    }
    this.setState({ratingCount: value, users})
  }

  filterCount(value){
    let filter = this.props.productRatingList.filter(
      rating => rating.reivew_star == value
    )
    return filter.length
  }

  render() {
    const {navigation, product, skuProduct, productRatingList} = this.props;
    const {isLoading, ratingCount, users} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Product Rating')} />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
          >
            <View style={styles.productInfo}>
              <View style={styles.productLogo}>
                <FallbackImage style={styles.image} source={product.product_images[0]}/>
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={styles.producName}>{skuProduct.name}</Text>
                <Text style={styles.producPrice}>{product.price}</Text>
              </View>
            </View>
            <View style={styles.selecter}>
              <View style={styles.selecterCol}>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 'all' && {backgroundColor: Colors.red}]} onPress={() => this.filterReview('all')} >
                  <Text style={[styles.selTxt, ratingCount=='all'&&{color: 'white'}]}>All ({productRatingList.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 5 && {backgroundColor: Colors.red}]} onPress={() => this.filterReview(5)} >
                  <Text style={[styles.selTxt, ratingCount == 5 && {color: 'white'}]}>5 Star ({this.filterCount(5)})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 4 && {backgroundColor: Colors.red}]} onPress={() => this.filterReview(4)} >
                  <Text style={[styles.selTxt, ratingCount == 4 && {color: 'white'}]}>4 Star ({this.filterCount(4)})</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.selecterCol}>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 3 && {backgroundColor: Colors.red}]} onPress={() => this.filterReview(3)} >
                  <Text style={[styles.selTxt, ratingCount == 3 && {color: 'white'}]}>3 Star ({this.filterCount(3)})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 2 && {backgroundColor: Colors.red}]} onPress={() => this.filterReview(2)} >
                  <Text style={[styles.selTxt, ratingCount == 2 && {color: 'white'}]}>2 Star ({this.filterCount(2)})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 1 && {backgroundColor: Colors.red}]} onPress={() => this.filterReview(1)} >
                  <Text style={[styles.selTxt, ratingCount == 1 && {color: 'white'}]}>1 Star ({this.filterCount(1)})</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.users}>
              {users.map((user, index) => (
                <View key={index} style={styles.userItem}>
                  <View style={styles.userImg}>
                    <FallbackImage style={styles.image} source={user.title}/>
                  </View>
                  <View style={styles.detail}>
                    <View style={styles.star}>
                        {[1,2,3,4,5].map((i, index) => 
                            <FontAwesomeIcon key={index} name='star' size={dynamicSize(15)} color={i <= user.reivew_star ? Colors.yellow : '#d5d4d4'} />)}
                    </View>
                    <Text style={styles.userCmt}>{user.detail}</Text>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.nickname} </Text>
                      <FontAwesomeIcon name='check-circle' size={dynamicSize(15)} color='#999999' />
                      <Text style={styles.userName}> {'Certified Buyer'}</Text>
                    </View>
                    <Text style={styles.date}>{this.formattedDate(user.created_at)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  contentStyle: {
  },
  productInfo: {
    padding: dynamicSize(10),
    width: '100%',
    flexDirection: 'row',
    borderColor: '#d7d7d7',
    borderBottomWidth: 1,
  },
  productLogo: {
    marginRight: dynamicSize(10),
    width: dynamicSize(50),
    height: dynamicSize(50),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  producName: {
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  producPrice: {
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  selecter: {
    marginVertical: dynamicSize(10),
    width: '100%',
  },
  selecterCol: {
    width: '100%',
    paddingVertical: dynamicSize(5),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectedItem: {
    width: dynamicSize(85),
    height: dynamicSize(40),
    backgroundColor: '#D7D7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selTxt: {
    fontSize: dynamicSize(14),
    color: 'black',
  },
  users: {
    marginHorizontal: dynamicSize(10),
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    borderWidth: 1,
  },
  userItem: {
    marginBottom: dynamicSize(10),
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(5),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    flexDirection: 'row',
  },
  userImg: {
    width: dynamicSize(65),
    height: dynamicSize(65),
    resizeMode: 'contain'
  },
  detail: {
    flex: 1,
    marginLeft: dynamicSize(15),
  },
  star: {
    paddingVertical: dynamicSize(5),
    flexDirection: 'row',
  },
  userCmt: {
    paddingVertical: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: '#212529',
  },
  userInfo: {
    paddingVertical: dynamicSize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: dynamicSize(13),
    color: '#999999',
  },
  date: {
    paddingVertical: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: '#999999',
  },
});

const mapStateToProps = ({ auth, user, product }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  product: product.product[0] ? product.product[0] : {},
  skuProduct: product.skuProduct,
  productRatingList: product.productRatingList,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductRating);