import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import _ from 'lodash';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';

import FallbackImage from './FallbackImage';
import WithButton from './WithButton';

import i18n from "@app/locale/i18n";
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

export default class ProductsCard extends React.Component {

    clickProduct = (id, sku) => {
        const {navigation} = this.props;
        if(navigation.state.routeName === 'ProductShow')
            navigation.goBack();
        navigation.navigate('ProductShow', {id, sku});
    }

    clickStore = (id) => {
        this.props.navigation.navigate('StoreShow', {id});
    }

    render() {
        const {id, entity_id, image, name, sku, final_price, price, rating_summary, rating_count, storeInfo, wishlist_count, cashback, imageSize} = this.props.data;
        return (
            <View style={[styles.slideItem, this.props.style]}>
                <TouchableOpacity style={styles.productInfo} onPress={() => this.clickProduct(entity_id ? entity_id : id, sku)}>
                    <View style={styles.imageView}>
                        <FallbackImage
                            style={[styles.image, imageSize && {height: imageSize}]}
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
                    {(cashback != 0) && <View style={styles.cashback}>
                        <Image style={{position: 'absolute'}} source={require('../assets/img/badge-ribbon.png')}/>
                        <Text style={styles.cashbackText}>{Math.abs(cashback)}%</Text>
                        <Text style={styles.cashbackText2}>Off</Text>
                    </View>}
                    <WithButton style={styles.whishButton} navigation={this.props.navigation} product={this.props.data}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.storeInfoBox} onPress={() => this.clickStore(storeInfo?.seller_id)}>
                    <View style={styles.storeInfo}>
                        <Text style={styles.storeText}>{storeInfo && storeInfo.shop_title && (storeInfo.shop_title.length > 20 ? storeInfo.shop_title.slice(0, 20) + '...' : storeInfo.shop_title)}</Text>
                        <View style={styles.location}>
                            <Icon name='map-marker' size={dynamicSize(11)} color='gray' />
                            <Text style={[styles.storeText, {marginLeft: 3}]}>{storeInfo && storeInfo.city}</Text>
                        </View>
                    </View>
                    <View style={styles.badges}>
                        {storeInfo && storeInfo.badge_image_url && <Image source={{uri: storeInfo && storeInfo.badge_image_url}} style={styles.badge}/>}
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

const styles = StyleSheet.create({
    slideItem: {
        width: SCREEN_WIDTH/2 - 10,
        borderLeftWidth: 1,
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
        height: SCREEN_WIDTH/2-25,
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
    whishButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    cashback: {
        position: 'absolute',
        top: 10,
        left: 10,
        alignItems: 'center',
    },
    cashbackText: {
        marginTop: 5,
        fontSize: dynamicSize(14),
        fontWeight: 'bold',
        color: 'white',
    },
    cashbackText2: {
        fontSize: dynamicSize(14),
        color: 'white',
    },
  });
