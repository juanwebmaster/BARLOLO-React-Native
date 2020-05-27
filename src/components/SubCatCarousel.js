import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

export default class SubCatCarousel extends React.Component {

    clickCatItem = (id) => {
        const {navigation} = this.props;
        if(navigation.state.routeName === 'CategoryShow')
            navigation.goBack();
        navigation.navigate('CategoryShow', {id, keyword : ''});
    }

    imageUrl = (data) => {
        const index = _.findIndex(data.custom_attributes, [
            'attribute_code',
            'category_menuicon'
          ]);          
        return 'http://barlolostaging.s3-ap-southeast-1.amazonaws.com/catalog/category/menuicon/' + data.custom_attributes[index]?.value;
    }

    _moveToNext = () => {
        this._carousel.snapToNext();
    }

    _moveToPrev = () => {
        this._carousel.snapToPrev();
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.slideItem}
                onPress={() => this.clickCatItem(item.id)}
            >
                <FallbackImage
                    style={styles.image}
                    source={this.imageUrl(item)}
                />
                <Text style={styles.catName}>{item.name}</Text>
            </TouchableOpacity>
        );
    }
    render () {
        if(!this.props.subcategories?.length) return null;
        const subcategories=this.props.subcategories.filter(item => item.include_in_menu);
        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{i18n.t('popular_sub_categories')}</Text>
                </View>
                <View style={styles.slider}>
                    <Carousel
                        key={'popularSubcategories'}
                        ref={(c) => { this._carousel = c; }}
                        data={subcategories}
                        renderItem={this._renderItem}
                        sliderWidth={SCREEN_WIDTH}
                        itemWidth={SCREEN_WIDTH/4}
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
        borderRightWidth: 1,
        borderBottomWidth: 1,
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
        width: SCREEN_WIDTH/4,
        padding: 3,
        height: dynamicSize(160),
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '70%',
        resizeMode: 'contain',
    },
    catName: {
        marginTop: dynamicSize(10),
        fontSize: dynamicSize(12),
        color: Colors.black,
        textAlign: 'center',
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
