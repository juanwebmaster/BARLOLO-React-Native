import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import { SCREEN_WIDTH, dynamicSize } from '../config';
import Colors from '@app/config/colors';
import i18n from "@app/locale/i18n";

class PurchaseCarousel extends React.Component {

  static defaultProps = {
    active: 0,
    activeSlideAlignment: 'center',
  }

  componentDidMount() {
    const { childRef } = this.props;
    childRef(this);
  }

  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }

  navs(purchaseHistory) {
    return [
      {
        label: 'My Cart',
        link: 'BuyerInCart',
        count:
          Object.keys(purchaseHistory).length &&
            purchaseHistory.incart.length
            ? purchaseHistory.incart[0].items.length
            : 0
      },
      {
        label: 'Seller To Confirm',
        link: 'BuyerSellerToConfirm',
        count:
          Object.keys(purchaseHistory).length &&
            purchaseHistory.total &&
            purchaseHistory.total.seller_to_confirm
            ? purchaseHistory.total.seller_to_confirm.order_count
            : 0
      },
      {
        label: 'To Receive',
        link: 'BuyerToReceive',
        count:
          Object.keys(purchaseHistory).length &&
            purchaseHistory.total &&
            purchaseHistory.total.to_recieve
            ? purchaseHistory.total.to_recieve.order_count
            : 0
      },
      {
        label: 'Completed',
        link: 'BuyerComplete',
        count:
          Object.keys(purchaseHistory).length &&
            purchaseHistory.total &&
            purchaseHistory.total.review
            ? purchaseHistory.total.review.order_count
            : 0
      },
      {
        label: 'Cancelled',
        link: 'BuyerCancelled',
        count:
          Object.keys(purchaseHistory).length &&
            purchaseHistory.total &&
            purchaseHistory.total.return_refund
            ? purchaseHistory.total.return_refund.order_count
            : 0
      }
      // {
      //   label: 'Return / Refund',
      //   link: 'BuyerReturnRefund',
      //   count:
      //     Object.keys(purchaseHistory).length &&
      //     purchaseHistory.total &&
      //     purchaseHistory.total.canceled
      //       ? purchaseHistory.return_refund.length
      //       : 0
      // }
    ]
  }

  _moveToNext = () => {
    this._carousel.snapToNext();
  }

  _moveToPrev = () => {
    this._carousel.snapToPrev();
  }

  snapToItem = (index) => {
    this._carousel.snapToItem(index);
  }

  clickCatItem = (link) => {
    this.props.navigation.goBack();
    this.props.navigation.navigate(link);
  }

  _renderItem = ({ item, index }) => {
    const { active } = this.props;
    return (
      <TouchableOpacity key={index} onPress={() => this.clickCatItem(item.link)}>
        <View style={[styles.catTabItem, active == index && styles.active]}>
          <Text style={[styles.catText, active == index && { color: Colors.red }]}>{i18n.t(item.label)} ({item.count})</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { active, purchaseHistory, activeSlideAlignment } = this.props;
    return (
      <View style={styles.slider}>
        <Carousel
          key={'PurchaseCarousel' + active}
          ref={(c) => { this._carousel = c; }}
          data={this.navs(purchaseHistory)}
          firstItem={active}
          renderItem={this._renderItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH / 3}
          activeSlideAlignment={activeSlideAlignment}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        <View style={styles.snapBtnBox}>
          <TouchableOpacity style={styles.snapBtn} onPress={this._moveToPrev}>
            <Icon name='angle-left' size={dynamicSize(20)} color={'rgba(0, 0, 0, 0.75)'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.snapBtn} onPress={this._moveToNext}>
            <Icon name='angle-right' size={dynamicSize(20)} color={'rgba(0, 0, 0, 0.75)'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {
    marginBottom: dynamicSize(10),
    justifyContent: 'center',
  },
  snapBtnBox: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snapBtn: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTabItem: {
    width: SCREEN_WIDTH / 3,
    minHeight: dynamicSize(50),
    paddingHorizontal: dynamicSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  catText: {
    fontSize: dynamicSize(14),
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  active: {
    borderColor: Colors.red,
    borderBottomWidth: 2,
  },
});

const mapStateToProps = ({ user, merchant }) => ({
  lang: user.lang,
  purchaseHistory: merchant.purchaseHistory,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchaseCarousel);
