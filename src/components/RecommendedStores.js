import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import i18n from "@app/locale/i18n";
import FallbackImage from './FallbackImage';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

class RecommendedStoresCard extends React.Component {
    clickProduct = (id, sku) => {
        this.props.navigation.navigate('ProductShow', {id, sku});
    }

    clickStore = (id) => {
        this.props.navigation.navigate('StoreShow', {id});
    }
    render() {
        const {seller_id, logo_pic, shop_title, shop_url, badge_image_url, images} = this.props.data;
        return (
            <View style={styles.slideItem}>
                <TouchableOpacity style={styles.shopInfo} onPress={() => this.clickStore(seller_id)}>
                    <View style={styles.logo}>
                        <FallbackImage
                            style={styles.image}
                            source={logo_pic}/>
                    </View>
                    <Text style={styles.shopTitle}>{ shop_title || shop_url }</Text>
                    <View style={styles.badge}>
                        <FallbackImage
                            style={styles.image}
                            source={badge_image_url}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.product}>
                {images.length > 2 ? 
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.clickProduct(images[0].entity_id, images[0].sku)}>
                                <FallbackImage
                                    style={styles.image}
                                    source={images[0]['image']}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.clickProduct(images[1].entity_id, images[1].sku)}>
                                <FallbackImage
                                    style={styles.image}
                                    source={images[1]['image']}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{flex: 2}} onPress={() => this.clickProduct(images[2].entity_id, images[2].sku)}>
                            <FallbackImage
                                style={styles.image}
                                source={images[2]['image']}/>
                        </TouchableOpacity>
                    </View>:
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.clickProduct(images[0].entity_id, images[0].sku)}>
                        <FallbackImage
                            style={styles.image}
                            source={images[0]['image']}/>
                    </TouchableOpacity>
                }
                </View>
            </View>
        );
    }

};

export default class RecommendedStores extends React.Component {
    clickViewStore = () => {
        this.props.navigation.navigate('RecommendedStore');
    }

    _moveToNext = () => {
        this._carousel.snapToNext();
    }

    _moveToPrev = () => {
        this._carousel.snapToPrev();
    }

    _renderItem = ({item, index}) => {
        return (
            <RecommendedStoresCard key={'RecommendedStores'+index} data={item} navigation={this.props.navigation}/>
        );
    }
    render () {
        if(!this.props.recommendedStores?.length) return null;
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{i18n.t('Recommended Store')}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.clickViewStore}>
                        <Text style={styles.label}>{i18n.t('View All')}</Text>
                        <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.slider}>
                    <Carousel
                        key={'RecommendedStores'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.props.recommendedStores}
                        renderItem={this._renderItem}
                        sliderWidth={SCREEN_WIDTH}
                        sliderHeight={dynamicSize(200)}
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
        width: SCREEN_WIDTH/2.5,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        height: dynamicSize(200),
    },
    shopInfo: {
        paddingTop: dynamicSize(10),
        paddingHorizontal: dynamicSize(10),
        flex: 1,
        flexDirection: 'row',
    },
    logo: {
        width: dynamicSize(30),
        height: dynamicSize(30),
    },
    shopTitle: {
        flex: 1,
        paddingHorizontal: dynamicSize(10),
        fontSize: dynamicSize(13),
        color: Colors.black,
    },
    badge: {
        marginTop: 5,
        width: dynamicSize(16),
        height: dynamicSize(16),
    },
    product: {
        flex: 2.6,
        padding: 2,
        flexDirection: 'row',
    },
    image: {
        width: '100%',
        height: '100%',
        // resizeMode: 'stretch',
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
