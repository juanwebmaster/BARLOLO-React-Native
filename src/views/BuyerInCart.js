import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  fetchCarts,
  clearCart
} from '../store/actions/cart';

import NavHeader from '../components/NavHeader';
import CartItemList from '../components/CartItemList';
import LoadingComponent from '../components/LoadingComponent';
import PurchaseCarousel from '../components/PurchaseCarousel';

import i18n from "@app/locale/i18n";

class BuyerInCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({isLoading: true});
      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.setState({isLoading: false});
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
          return;
        }
        this.props.fetchCarts(this.props.userId)
        .then(() => {
          this.setState({isLoading: false});
        })
      })
      .catch(error => {
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
    this.blurListener = navigation.addListener('didBlur', ({state, action}) => {
      if(this._carousel) this._carousel.snapToItem(0);
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
    this.blurListener.remove();
  }

  onClear = () => {
    this.setState({isLoading: true});
    this.props.clearCart(this.props.userId)
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(error => {
      this.setState({isLoading: false});
    })
  }

  render() {
    const {navigation} = this.props;
    const {isLoading} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('My Purchase')} isChatBtn={true} />
          <PurchaseCarousel childRef={(c) => { this._carousel = c; }} navigation={navigation} active={0} activeSlideAlignment='start'/>
          <CartItemList navigation={navigation} />
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
});

const mapStateToProps = ({ auth, user }) => ({
  isLogged: auth.isLogged,
  userId: auth.user.id,
  lang: user.lang,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchCarts,
  clearCart,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuyerInCart);