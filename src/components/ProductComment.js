import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import ProductService from '../services/ProductService';
import {fetchProductCommentList} from '../store/actions/product';

import ProductCommentform from '../components/ProductCommentform';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';


class ProductComment extends React.Component {
    state = {
      repliedOn: -1,
      hideComment: true,
      isLoading: false,
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

    render () {
      const {hideComment, isLoading, repliedOn} = this.state;
      const {
        productCommentList,
        isLogged,
        handleIsNotLoggedIn,
        handleProductComment,
        user,
      } = this.props;
      return (
          <View style={styles.container}>
            <View style={styles.titleBar}>
              <Text style={styles.title}>{i18n.t('Comments')}</Text>
              <TouchableOpacity style={styles.showBtn} onPress={() => this.setState({hideComment: !hideComment})}>
                <Icon
                  name={hideComment ? 'angle-up' : 'angle-down'}
                  size={dynamicSize(16)}
                  color='gray'
                />
              </TouchableOpacity>
            </View>
            {hideComment && <View style={styles.commentList}>
              {productCommentList.length > 0 ?
              <View style={styles.commentList}>
                {productCommentList.map((item, index) => {
                  return index == 0 && <View key={index} style={styles.commentListItem}>
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
                      {repliedOn == item.id && ( isLogged ?
                      <ProductCommentform user={user} onSubmit={this.onSubmitReply}/> :
                      <TouchableOpacity style={styles.button} onPress={handleIsNotLoggedIn}>
                        <Text style={styles.btnLabel}>{'You must login to reply!'}</Text>
                      </TouchableOpacity>)}
                    </View>
                  </View>
                })}
              </View> : 
              <View style={styles.commentListItem}>
                <Text style={styles.label}>{i18n.t('no_comment')}</Text>
              </View>
              }
              {productCommentList.length > 1 &&
              <TouchableOpacity style={styles.viewAllCmm} onPress={handleProductComment}>
                <Text style={styles.label}>{i18n.t('View All')} {i18n.t('Comment')} ({productCommentList.length})</Text>
                <FontAwesomeIcon name='angle-right' size={dynamicSize(16)} />
              </TouchableOpacity>
              }
              {isLogged ? <ProductCommentform style={styles.commentForm} user={user} onSubmit={this.onSubmit}/> :
              <TouchableOpacity style={styles.button} onPress={handleIsNotLoggedIn}>
                <Text style={styles.btnLabel}>{i18n.t('login_to_comment')}</Text>
              </TouchableOpacity>}
            </View>}
            <LoadingComponent visible={isLoading}/>
          </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: dynamicSize(10),
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  titleBar: {
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(10),
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: dynamicSize(16),
    fontWeight: 'bold',
    color: Colors.black,
  },
  showBtn: {
    marginRight: dynamicSize(10),
  },
  body: {
    width: '100%',
    marginVertical: dynamicSize(20),
    alignItems: 'flex-start',
  },
  commentList: {
    paddingHorizontal: dynamicSize(5),
    width: '100%',
    alignItems: 'flex-start',
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
    marginTop: 5,
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
  button: {
    margin: dynamicSize(10),
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(30),
    backgroundColor: Colors.red,
    borderRadius: dynamicSize(8),
    alignSelf: 'flex-start',
  },
  btnLabel: {
    fontSize: dynamicSize(14),
    color: 'white',
  },
  viewAllCmm: {
    padding: dynamicSize(10),
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  commentForm: {
    paddingHorizontal: dynamicSize(10),
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
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
  fetchProductCommentList
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductComment);