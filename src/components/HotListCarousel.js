import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import i18n from "@app/locale/i18n";
import FallbackImage from './FallbackImage';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

class HotListCarouselCard extends React.Component {

    onClick = (pramas) => {
        const id = pramas[0].value;
        this.props.navigation.navigate('HotList', {id});
    }
    
    render() {
        const {image, text, pramas} = this.props.data;
        return (
            <View style={styles.slideItem}>
                <TouchableOpacity style={styles.slideItem} onPress={() => this.onClick(pramas)}>
                    <View style={styles.imageView}>
                        <FallbackImage
                            style={styles.image}
                            source={image}/>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.context}>{text && text.replace('&amp;', '&')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

};

export default class HotListCarousel extends React.Component {
    onClick = () => {
        const id = this.props.hotlists[0].pramas[0].value;
        this.props.navigation.navigate('HotList', {id});
    }

    _moveToNext = () => {
        this._carousel.snapToNext();
    }

    _moveToPrev = () => {
        this._carousel.snapToPrev();
    }

    _renderItem = ({item, index}) => {
        return (
            <HotListCarouselCard key={'HotListCarousel'+index} data={item} navigation={this.props.navigation}/>
        );
    }

    render () {
        if(!this.props.hotlists?.length) return null;
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{i18n.t('Hot List')}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.onClick}>
                        <Text style={styles.label}>{i18n.t('View All')}</Text>
                        <Icon name='angle-right' size={dynamicSize(18)} color={Colors.red}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.slider}>
                    <Carousel
                        key={'HotListCarousel'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.props.hotlists}
                        renderItem={this._renderItem}
                        sliderWidth={SCREEN_WIDTH}
                        sliderHeight={dynamicSize(200)}
                        itemWidth={SCREEN_WIDTH/2.5}
                        loop={true}
                        autoplay={true}
                        autoplayInterval={6000}
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
        borderTopWidth: 1,
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
    imageView: {
        flex: 1,
    },
    contentView: {
        paddingTop: 5,
        paddingBottom: dynamicSize(15),
        paddingHorizontal: 5,
        backgroundColor: Colors.red,
    },
    image: {
        width: '100%',
        height: '100%',
        // resizeMode: 'stretch',
    },
    context: {
        fontSize: dynamicSize(14),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        height: dynamicSize(36)
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
