import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import {handleAddToWishList, handleRemoveFromWishList, fetchWishlists} from '../store/actions/product';
import {setRedirectLink} from '../store/actions/loading';

class WithButton extends React.Component {

  state = {
    loading: false,
    active: this.props.product.is_wishlist,
  }

  wishListItem() {
    const {product} = this.props;
    return this.props.wishlistProductIdList.find(
      x => x.product_id == product.entity_id
    )
  }

  addToWishList(productId) {
    this.setState({loading: true});
    this.props.handleAddToWishList({
        productId,
        customerId: this.props.user.id
      })
      .then(() => {
        this.setState({active: true, loading: false});
      })
      .catch(error => {
        console.log('delFromWishlist ==> ', error);
        this.setState({loading: false});
        this.handleIsNotLoggedIn();
      })
  }

  delFromWishlist(productId) {
    if(!this.wishListItem()) {
      this.setState({active: false});
    } else {
      this.setState({loading: true});
    }
    this.props.handleRemoveFromWishList({
      wishItemId: productId,
      customerId: this.props.user.id
    })
    .then(() => {
      this.setState({active: false, loading: false});
    })
    .catch(error => {
      console.log('delFromWishlist ==> ', error);
      this.setState({loading: false});
      this.handleIsNotLoggedIn();
    })
  }

  handleIsNotLoggedIn = () => {
    this.props.setRedirectLink(this.props.navigation.state.routeName)
    this.props.navigation.navigate('Login');
  }

  onTap = () => {
    const {active} = this.state;
    const {isLogged, product} = this.props;
    if (!isLogged) {
      this.handleIsNotLoggedIn();
      return
    }
    active ? this.delFromWishlist(this.wishListItem()?.wishlist_item_id) : this.addToWishList(product.entity_id);
  }

  render() {
    const {style} = this.props;
    const {active, loading} = this.state;
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={this.onTap}>
        <Icon name='heart' size={dynamicSize(18)} color={active ? Colors.red : 'gray'} />
        {/* <Icon name='heart' size={dynamicSize(18)} color={active || this.wishListItem() ? Colors.red : 'gray'} /> */}
        {loading && <View style={styles.loading}>
          <ActivityIndicator/>
        </View>}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: dynamicSize(26),
    height: dynamicSize(26),
    borderRadius: dynamicSize(13),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A0',
  }
});

const mapStateToProps = ({ auth, product }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  wishlistProductIdList: product.wishlistProductIdList,
});

const mapDispatchToProps = {
  handleAddToWishList,
  handleRemoveFromWishList,
  setRedirectLink,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithButton);