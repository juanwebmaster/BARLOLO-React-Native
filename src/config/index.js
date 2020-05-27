/* eslint-disable prettier/prettier */
import {Platform, Dimensions} from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

const unit = SCREEN_WIDTH / 400;
export const dynamicSize = (size) => unit * size;
