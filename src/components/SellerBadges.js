import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import FallbackImage from './FallbackImage';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

export default class SellerBadges extends React.Component {

    clickViewStore = () => {
        this.props.navigation.navigate('OfficalStore');
    }
    
    clickStore = (id) => {
        this.props.navigation.navigate('StoreShow', { id });
    }

    _moveToNext = () => {
        this._carousel.snapToNext();
    }

    _moveToPrev = () => {
        this._carousel.snapToPrev();
    }

    _renderItem = ({item, index}) => {
        return (
            <View key={'SellerBadges' + index} style={styles.slideItem} >
                <TouchableOpacity style={styles.itemBtn} onPress={() => this.clickStore(item[0].seller_id)}>
                    <FallbackImage
                        style={styles.image}
                        source={item[0]['logo_pic']}/>
                </TouchableOpacity>
                {item[1] && <TouchableOpacity style={styles.itemBtn} onPress={() => this.clickStore(item[1].seller_id)}>
                    <FallbackImage
                        style={styles.image}
                        source={item[1]['logo_pic']}/>
                </TouchableOpacity>}
            </View>
        );
    }

    render () {
        const {sellerBadges} = this.props;
        if(!sellerBadges?.length) return null;
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{i18n.t('offical_store')}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.clickViewStore}>
                        <Text style={styles.label}>{i18n.t('View All')}</Text>
                        <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.slider}>
                    <Carousel
                        key={'SellerBadges'}
                        ref={(c) => { this._carousel = c; }}
                        data={sellerBadges}
                        renderItem={this._renderItem.bind(this)}
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
        borderColor: Colors.borderColor,
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
    },
    itemBtn: {
        paddingVertical: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        height: dynamicSize(85),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
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
