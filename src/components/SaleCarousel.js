import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import FallbackImage from './FallbackImage';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

class SaleCarouselCard extends React.Component {

    clickProduct = (id, sku) => {
        this.props.navigation.navigate('ProductShow', {id, sku});
    }

    clickStore = (id) => {
        this.props.navigation.navigate('StoreShow', {id});
    }

    render() {
        const {id, entity_id, image, name, sku, final_price, price, rating_summary, rating_count, storeInfo, wishlist_count} = this.props.data;
        return (
            <View style={styles.slideItem}>
                <TouchableOpacity style={styles.productInfo} onPress={() => this.clickProduct(entity_id ? entity_id : id, sku)}>
                    <View style={styles.imageView}>
                        <FallbackImage
                            style={styles.image}
                            source={image}/>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.productName}>{name}</Text>
                        <Text style={styles.productPrice}>{final_price} <Text style={styles.productPriceOld}>{final_price != price && price}</Text></Text>
                        <View style={styles.rankingView}>
                            <View style={styles.star}>
                                {[1,2,3,4,5].map((i, index) => 
                                    <FontAwesomeIcon key={index} name='star' size={dynamicSize(15)} color={i <= Math.floor(rating_summary / 20) ? Colors.yellow : '#d5d4d4'} />)}
                            </View>
                            <Text style={styles.ranking}> ({rating_count})</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.storeInfoBox} onPress={() => this.clickStore(storeInfo.seller_id)}>
                    <View style={styles.storeInfo}>
                        <Text style={styles.storeText}>{storeInfo && storeInfo.shop_title && (storeInfo.shop_title.length > 15 ? storeInfo.shop_title.slice(0, 15) + '...' : storeInfo.shop_title)}</Text>
                        <View style={styles.location}>
                            <Icon name='map-marker' size={dynamicSize(11)} color='gray' />
                            <Text style={[styles.storeText, {marginLeft: 3}]}>{storeInfo.city}</Text>
                        </View>
                    </View>
                    <View style={styles.badges}>
                        <Image source={{uri: storeInfo.badge_image_url}} style={styles.badge}/>
                        <View style={styles.wishView}>
                            <FontAwesomeIcon name='heart' size={dynamicSize(11)} color='gray' />
                            <Text style={[styles.storeText, {marginLeft: 3}]}>{wishlist_count}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

};

export default class SaleCarousel extends React.Component {
    clickViewAll = () => {
        this.props.navigation.navigate('SaleProduct');
    }

    _moveToNext = () => {
        this._carousel.snapToNext();
    }

    _moveToPrev = () => {
        this._carousel.snapToPrev();
    }

    _renderItem = ({item, index}) => {
        return (
            <SaleCarouselCard navigation={this.props.navigation} key={'SaleCarousel'+index} data={item}/>
        );
    }
    render () {
        if(!this.props.saleProduct?.length) return null;
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{i18n.t('Sale Product')}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.clickViewAll}>
                        <Text style={styles.label}>{i18n.t('View All')}</Text>
                        <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.slider}>
                    <Carousel
                        key={'SaleCarousel'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.props.saleProduct}
                        renderItem={this._renderItem}
                        sliderWidth={SCREEN_WIDTH}
                        itemWidth={SCREEN_WIDTH/2.5}
                        loop={true}
                        autoplay={true}
                        autoplayInterval={5000}
                        activeSlideAlignment='start'
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        nestedScrollEnabled={true}
                        removeClippedSubviews={true}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    titleBar: {
        width: '100%',
        paddingHorizontal: dynamicSize(10),
        paddingVertical: dynamicSize(12),
        borderTopWidth: 2,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: dynamicSize(16),
        fontWeight: 'bold',
        color: Colors.black,
    },
    label: {
        marginRight: dynamicSize(10),
        fontSize: dynamicSize(14),
        color: Colors.red,
    },
    slideItem: {
        flex: 1,
        width: SCREEN_WIDTH/2.5,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
    },
    productInfo: {
        flex: 1,
    },
    imageView: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentView: {
        flex: 1,
        paddingHorizontal: 5,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: SCREEN_WIDTH/2.5-20,
        resizeMode: 'contain',
    },
    productName: {
        flex: 1,
        fontSize: dynamicSize(14),
        color: 'gray',
    },
    productPrice: {
        paddingVertical: 3,
        fontSize: dynamicSize(13),
        color: Colors.red,
    },
    productPriceOld: {
        fontSize: dynamicSize(13),
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    rankingView: {
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    star: {
        flexDirection: 'row',
    },
    ranking: {
        fontSize: dynamicSize(11),
        color: 'gray',
    },
    storeInfoBox: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'dashed',
        borderRadius: dynamicSize(10),
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
    },
    storeInfo: {
        height: dynamicSize(35),
        justifyContent: 'space-between',
    },
    storeText: {
        fontSize: dynamicSize(11),
        color: 'gray',
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badges: {
        height: dynamicSize(35),
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    badge: {
        width: dynamicSize(16),
        height: dynamicSize(16),
    },
    wishView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
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
  });
