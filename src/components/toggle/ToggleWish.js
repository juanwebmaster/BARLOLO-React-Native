import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../config/colors';
import {dynamicSize} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

import {handleAddToWishList, handleRemoveFromWishList, fetchWishlists} from '../../store/actions/product';

export default class ToggleWish extends React.Component {
  
  state = {
    loading: false,
    active: this.props.product.is_wishlist,
  }

  wishListItem() {
    const {product} = this.props;
    return this.props.wishlistProductIdList.find(
      x => +x.product_id === product.id
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
        this.props.fetchWishlists(this.props.user.id);
      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error.response)
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
      this.props.fetchWishlists(this.props.user.id);
    })
    .catch(error => {
      this.setState({loading: false});
      console.log(error.response)
    })
  }

  onTap = () => {
    const {active} = this.state;
    const {isLogged, product} = this.props;
    if (!isLogged) {
      this.props.handleIsNotLoggedIn();
      return
    }
    active ? this.delFromWishlist(this.wishListItem()?.wishlist_item_id) : this.addToWishList(product.id);
  }

  render() {
    const { style } = this.props;
    const {active, loading} = this.state;
    return (
      <TouchableOpacity style={style} onPress={this.onTap}>
        <View style={styles.container}>
          <Icon name='heart' size={dynamicSize(20)} color={active || this.wishListItem() ? Colors.red : 'gray'} />
          {loading && <View style={styles.loading}>
            <ActivityIndicator/>
          </View>}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: dynamicSize(40),
    height: dynamicSize(40),
    borderRadius: dynamicSize(20),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.placeholder,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
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
  fetchWishlists,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleWish);