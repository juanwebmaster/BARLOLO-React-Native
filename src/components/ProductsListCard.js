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

export default class ProductsListCard extends React.Component {

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
        const {id, entity_id, image, name, sku, final_price, price, rating_summary, rating_count, storeInfo, wishlist_count, cashback} = this.props.data;
        return (
            <View style={[styles.slideItem, this.props.style]}>
                <TouchableOpacity style={styles.imageView} onPress={() => this.clickProduct(entity_id ? entity_id : id, sku)}>
                    <FallbackImage
                        style={styles.image}
                        source={image}/>
                    <WithButton style={styles.whishButton} product={this.props.data} navigation={this.props.navigation} />
                    {(cashback != 0) && <View style={styles.cashback}>
                        <Image style={{position: 'absolute'}} source={require('../assets/img/badge-ribbon.png')}/>
                        <Text style={styles.cashbackText}>{Math.abs(cashback)}%</Text>
                        <Text style={styles.cashbackText2}>Off</Text>
                    </View>}
                </TouchableOpacity>
                <View style={{flex: 1, padding: 10}}>
                    <TouchableOpacity style={styles.productInfo} onPress={() => this.clickProduct(entity_id ? entity_id : id, sku)}>
                        <View style={styles.contentView}>
                            <Text style={styles.productName}>{name && name.length > 12 ? name.slice(0, 12)+'...' : name}</Text>
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
                    <TouchableOpacity style={styles.storeInfoBox} onPress={() => this.clickStore(storeInfo?.seller_id)}>
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeText}>{storeInfo && storeInfo.shop_title && (storeInfo.shop_title.length > 15 ? storeInfo.shop_title.slice(0, 15) + '...' : storeInfo.shop_title)}</Text>
                            <View style={styles.location}>
                                <Icon name='map-marker' size={dynamicSize(11)} color='gray' />
                                <Text style={[styles.storeText, {marginLeft: 3}]}>{storeInfo && storeInfo.city}</Text>
                            </View>
                        </View>
                        <View style={styles.badges}>
                            <Image source={{uri: storeInfo && storeInfo.badge_image_url}} style={styles.badge}/>
                            <View style={styles.wishView}>
                                <FontAwesomeIcon name='heart' size={dynamicSize(11)} color='gray' />
                                <Text style={[styles.storeText, {marginLeft: 3}]}>{wishlist_count}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    slideItem: {
        width: SCREEN_WIDTH - 20,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        height: dynamicSize(150),
    },
    imageView: {
        width: dynamicSize(150),
        padding: dynamicSize(10),
        paddingHorizontal: dynamicSize(15),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    productInfo: {
        flex: 2,
    },
    contentView: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: dynamicSize(16),
        color: 'gray',
    },
    productPrice: {
        fontSize: dynamicSize(14),
        color: Colors.red,
    },
    productPriceOld: {
        fontSize: dynamicSize(13),
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    rankingView: {
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
        paddingHorizontal: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderRadius: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
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
        alignItems: 'flex-end',
    },
    badge: {
        width: dynamicSize(18),
        height: dynamicSize(18),
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
