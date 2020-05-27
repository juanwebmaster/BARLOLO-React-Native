import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import ProductsCard from './ProductsCard';

export default class ProductsCarousel extends React.Component {
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
            <ProductsCard
                style={styles.card}
                navigation={this.props.navigation}
                key={'ProductsCarousel'+index}
                data={item}
                imageSize={SCREEN_WIDTH/2.5-30}
            />
        );
    }
    _renderEmpty = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyTxt}>{i18n.t('No Product Available')}</Text>
            </View>
        );
    }
    render () {
        if(!this.props.products?.length) return null;
        return (
            <View style={styles.container}>
                <View style={styles.slider}>
                    <Carousel
                        key={'SaleCarousel'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.props.products}
                        renderItem={this._renderItem}
                        // ListEmptyComponent={this._renderEmpty}
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
                {this.props.products.length == 0 && this._renderEmpty()}
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
    card: {
        flex: 1,
        width: SCREEN_WIDTH/2.5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
        borderColor: Colors.borderColor,
    },
    emptyView: {
        paddingVertical: dynamicSize(10),
        paddingHorizontal: dynamicSize(20),
        width: SCREEN_WIDTH,
        borderColor: Colors.borderColor,
        borderTopWidth: 1,
    },
    emptyTxt: {
        fontSize: dynamicSize(14),
        color: Colors.black,
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
