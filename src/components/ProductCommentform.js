import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import i18n from "@app/locale/i18n";
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import Colors from '@app/config/colors';

export default class ProductCommentform extends React.Component {
    state = {
      comment: '',
    }

    image(user) {
      let getProfile = _.find(user.custom_attributes, {
        attribute_code: 'profile_image'
      })
      if (getProfile) {
        return `https://ik.imagekit.io/5ydszqfee/customer/${getProfile['value']}`
      }
      return 'https://ik.imagekit.io/5ydszqfee/avatar/noimage.png'
    }

    render () {
      const {comment} = this.state;
      const {style, user, onSubmit} = this.props;
      return (
          <View style={[styles.container, style]}>
            <View style={styles.inputform}>
              <View style={styles.userinfo}>
                <View style={styles.avatar}>
                  {user.custom_attributes?
                  <Image style={styles.avatarImg} source={{uri: this.image(user)}} />:
                  <FontAwesomeIcon name='user' size={dynamicSize(18)} color='gray' />}
                </View>
                <View style={styles.chatInfo}>
                  <Text style={styles.label}>{user?.firstname} ({i18n.t('you')})</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={i18n.t('Add Comment')}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({ comment: text })}
                  value={comment}
                  multiline={true}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {
              onSubmit(comment);
              this.setState({comment: ''});
            }}>
              <Text style={styles.btnLabel}>{i18n.t('Submit')}</Text>
            </TouchableOpacity>
          </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 5,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  inputform: {
    width: '100%',
  },
  userinfo: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: dynamicSize(10),
  },
  avatar: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    borderRadius: dynamicSize(15),
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    paddingHorizontal: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  inputContainer: {
    width: '100%',
    minHeight: dynamicSize(50),
    paddingVertical: dynamicSize(5),
    paddingHorizontal: dynamicSize(10),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: dynamicSize(8),
  },
  textInput: {
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  button: {
    margin: dynamicSize(10),
    paddingVertical: dynamicSize(10),
    paddingHorizontal: dynamicSize(30),
    backgroundColor: Colors.red,
    borderRadius: dynamicSize(8),
  },
  btnLabel: {
    fontSize: dynamicSize(14),
    color: 'white',
  },
  avatarImg: {
    width: dynamicSize(30),
    height: dynamicSize(30),
    resizeMode: 'stretch',
  },
});
