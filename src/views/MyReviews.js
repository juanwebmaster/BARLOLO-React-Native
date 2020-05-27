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
import {fetchBuyerReview} from '../store/actions/merchant';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class MyReviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      toggleReviewForm: false,
      ratingCount: 'all',
      reviews: [],
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
        reviews: [],
      });

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        this.props.fetchBuyerReview(this.props.user.id)
        .then(() => {
          this.setState({isLoading: false, reviews: this.props.buyerProductReviews});
        })
        .catch(error => {
          this.setState({isLoading: false});
        })        
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
    let reviews = [];
    if (value == 'all') {
      reviews = this.props.buyerProductReviews
    } else {
      reviews = this.props.buyerProductReviews.filter(
        rating => rating.star == value
      )
    }
    this.setState({ratingCount: value, reviews})
  }

  filterCount(value){
    const {buyerReview} = this.props;
    return buyerReview.count ? buyerReview.count[value] : 0;
  }

  clickProduct = (id, sku) => {
    this.props.navigation.navigate('ProductShow', {id, sku});
  }

  render() {
    const {navigation} = this.props;
    const {isLoading, ratingCount, reviews} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('My Reviews')} />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
          >
            <View style={styles.selecter}>
              <View style={styles.selecterCol}>
                <TouchableOpacity style={[styles.selectedItem, ratingCount == 'all' && {backgroundColor: Colors.red}]} onPress={() => this.filterReview('all')} >
                  <Text style={[styles.selTxt, ratingCount=='all'&&{color: 'white'}]}>All ({this.filterCount('all')})</Text>
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
            <View style={styles.reviews}>
              {reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <TouchableOpacity style={styles.reviewImg} onPress={() => this.clickProduct(review.product_id, review.sku)}>
                    <FallbackImage style={styles.image} source={review.image}/>
                  </TouchableOpacity>
                  <View style={styles.detail}>
                    <Text style={styles.reviewName}>{review.product_name} </Text>
                    <View style={styles.star}>
                        {[1,2,3,4,5].map((i, index) => 
                            <FontAwesomeIcon key={index} name='star' size={dynamicSize(15)} color={i <= review.star ? Colors.yellow : '#d5d4d4'} />)}
                    </View>
                    <Text style={styles.reviewCmt}>{review.summar_text}</Text>
                    <Text style={styles.date}>{this.formattedDate(review.date)}</Text>
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
  reviews: {
    marginHorizontal: dynamicSize(10),
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    borderWidth: 1,
  },
  reviewItem: {
    marginBottom: dynamicSize(10),
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(5),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    flexDirection: 'row',
  },
  reviewImg: {
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
  reviewCmt: {
    paddingVertical: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: '#212529',
  },
  reviewInfo: {
    paddingVertical: dynamicSize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewName: {
    paddingVertical: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  date: {
    paddingVertical: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: '#999999',
  },
});

const mapStateToProps = ({ auth, user, merchant }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  buyerReview: merchant.buyerReview,
  buyerProductReviews: merchant.buyerProductReviews,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchBuyerReview,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyReviews);