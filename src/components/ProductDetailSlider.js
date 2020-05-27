import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper'
import _ from 'lodash';

import FallbackImage from './FallbackImage'

import Colors from '../config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

export default class ProductDetailSlider extends React.Component {
  static defaultProps = {
    imageType: '',
    images: [],
  }

  render() {
    const {style, images, imageType} = this.props;
    return (
      <View style={[styles.container, style]}>
        <Swiper
          key={images.length}
          activeDotColor={Colors.white}
          width={SCREEN_WIDTH}
          height={dynamicSize(400)}
          nestedScrollEnabled={true}
          removeClippedSubviews={true}
          // showsButtons={true}
          autoplayTimeout={3}
          autoplay={true}
          pagingEnabled={true}
        >
          {images.map((item, index) => {
            return imageType ?
            <View key={index} style={styles.imageContainer}>
                <FallbackImage
                    style={styles.image}
                    source={item[imageType]}/>
            </View>: 
            <View key={index} style={styles.imageContainer}>
                <FallbackImage
                    style={styles.image}
                    source={item}/>
            </View>
          })}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: dynamicSize(400),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});
