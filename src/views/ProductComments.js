import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import ProductService from '../services/ProductService';
import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchProductCommentList} from '../store/actions/product';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import ProductCommentform from '../components/ProductCommentform';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {dynamicSize} from '../config';

class ProductComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      repliedOn: -1,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({isLoading: true, repliedOn: -1});

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

  onSubmit = (message) => {
    if(!message) return;
    const {user, skuProduct} = this.props;
    let comment = {
      customer_id: user.id,
      product_id: skuProduct.id,
      detail: message
    }
    this.setState({isLoading: true});
    ProductService.createQuestion({ data: comment })
      .then(() => {
        this.props.fetchProductCommentList(skuProduct.id)
        .then(() => 
        this.setState({isLoading: false}))

      })
      .catch(error => {
        console.log(error)
        this.setState({isLoading: false});
      })
  }

  onSubmitReply = (message) => {
    if(!message) return;
    const {user, skuProduct} = this.props;
    const {repliedOn} = this.state;
    let comment = {
      customer_id: user.id,
      product_id: skuProduct.id,
      detail: message,
      question_id: repliedOn,
    }
    ProductService.createAnswer({ data: comment })
      .then(() => {
        this.props.fetchProductCommentList(skuProduct.id)
        .then(() => this.setState({isLoading: false}))
      })
      .catch(error => {
        console.log(error)
        this.setState({isLoading: false});
      })
  }

  timeDiff(then, now = moment(new Date())) {
    const t = moment(new Date(then.replace(' at ', ' ')))
    return moment.duration(t.diff(now)).humanize()
  }

  image(user) {
    let getProfile = _.find(user.custom_attributes, {
      attribute_code: 'profile_image'
    })
    if (getProfile) {
      return `https://ik.imagekit.io/5ydszqfee/customer/${getProfile['value']}`
    }
    return 'https://ik.imagekit.io/5ydszqfee/avatar/noimage.png'
  }

  render() {
    const {navigation, product, skuProduct, productCommentList, user} = this.props;
    const {isLoading, repliedOn} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Product Comments')} />
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
          <View style={styles.commentBody}>
            <View style={styles.titleBar}>
              <Text style={styles.title}>{i18n.t('Comments')}</Text>
            </View>
            <View style={styles.commentList}>
              {productCommentList.length > 0 ?
              <View style={styles.commentList}>
                {productCommentList.map((item, index) => (
                  <View key={index} style={styles.commentListItem}>
                    <View style={styles.avatar}>
                    {user.custom_attributes?
                      <Image style={styles.avatarImg} source={{uri: this.image(user)}} />:
                      <FontAwesomeIcon name='user' size={dynamicSize(20)} color='gray' />}
                    </View>
                    <View style={{flex: 1}}>
                      <View style={styles.chatInfo}>
                        <Text style={styles.author_name}>{item.author_name}</Text>
                        <Text style={styles.content}>{item.content}</Text>
                      </View>
                      <View style={styles.reply}>
                        <Text style={styles.replyTxt}>{this.timeDiff(item.created_at)}  <Text style={repliedOn == item.id && {color: Colors.red, textDecorationLine: 'underline'}} onPress={() => this.setState({repliedOn: repliedOn==item.id ? -1 : item.id})}>Reply</Text></Text>
                      </View>
                      <View style={styles.answer}>
                        {item.answers && item.answers.map((answer, index) => (
                          <View key={'answer:'+index} style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={styles.avatar}>
                              <FontAwesomeIcon name='user' size={dynamicSize(20)} color='gray' />
                            </View>
                            <View style={{flex: 1}}>
                              <View style={styles.chatInfo}>
                                <Text style={styles.author_name}>{answer.author_name}</Text>
                                <Text style={styles.content}>{answer.content}</Text>
                              </View>
                              <View style={styles.reply}>
                                <Text style={styles.replyTxt}>{this.timeDiff(answer.created_at)}</Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                      {repliedOn == item.id && 
                      <ProductCommentform user={user} onSubmit={this.onSubmitReply}/>}
                    </View>
                  </View>
                ))}
              </View> : 
              <View style={styles.commentListItem}>
                <Text style={styles.label}>{i18n.t('no_comment')}</Text>
              </View>
              }
            </View>
          </View>
          </ScrollView>
          <ProductCommentform style={{paddingHorizontal: 20}} user={user} onSubmit={this.onSubmit}/>
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.borderColor,
  },
  scroll: {
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
  title: {
    fontSize: dynamicSize(15),
    fontWeight: 'bold',
    color: Colors.black,
  },
  commentBody: {
    width: '100%',
    padding: dynamicSize(10),
    backgroundColor: 'white',
  },
  commentList: {
    paddingHorizontal: dynamicSize(5),
    width: '100%',
  },
  label: {
    paddingHorizontal: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  commentListItem: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: dynamicSize(10),
  },
  avatar: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    borderRadius: dynamicSize(15),
    backgroundColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inputform: {
    width: '100%',
    marginTop: dynamicSize(5),
    paddingHorizontal: dynamicSize(20),
  },
  chatInfo: {
    flex: 1,
    marginLeft: dynamicSize(10),
    padding: dynamicSize(10),
    backgroundColor: '#D7D7D7',
    borderRadius: dynamicSize(10),
  },
  author_name: {
    fontSize: dynamicSize(13),
    letterSpacing: 1,
    color: '#212529',
    fontWeight: 'bold',
  },
  content: {
    fontSize: dynamicSize(11),
    color: '#212529',
    fontWeight: 'bold',
  },
  reply: {
    marginTop: dynamicSize(5),
    marginLeft: dynamicSize(10),
  },
  replyTxt: {
    fontSize: dynamicSize(13),
    color: Colors.gray,
  },
  avatarImg: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    resizeMode: 'stretch',
  },
});

const mapStateToProps = ({ auth, user, product }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  product: product.product[0] ? product.product[0] : {},
  skuProduct: product.skuProduct,
  productCommentList: product.productCommentList,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchProductCommentList
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductComments);