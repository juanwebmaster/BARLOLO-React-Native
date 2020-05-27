/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import {NavigationActions} from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

import FallbackImage from './FallbackImage';

const logoImg = require('../assets/img/logo.png');

class MainMenu extends React.Component {
  state = {
    active: -1,
    activeSub: -1,
  }

  navigateToScreen = (route, params) => {
    this.setState({active: -1, activeSub: -1});
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params,
    });
    this.props.navigation.toggleDrawer();
    this.props.navigation.dispatch(navigateAction);
  }

  clickSubCat = (subCategory) => {
    this.navigateToScreen('CategoryShow', {id: subCategory.entity_id, keyword : ''})
  }

  render() {
    const {headerCategories} = this.props;
    const {active, activeSub} = this.state;
    return (
        <View style={styles.container}>
          <ScrollView removeClippedSubviews={true}>
            <View style={styles.titleBar}>
              <TouchableOpacity onPress={() => this.navigateToScreen('Home')}>
                <Image
                  style={styles.logo}
                  source={logoImg}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
                <FontAwesomeIcon name='window-close' size={dynamicSize(22)} color={Colors.red}/>
              </TouchableOpacity>
            </View>
            {headerCategories.map((category, index) => {
              return category.categoryDetails && category.categoryDetails.include_in_menu == 1 ?
                <View key={category.categoryDetails.entity_id} style={styles.listItem}>
                  <TouchableOpacity style={[
                    styles.catagoryIten,
                    active == category.categoryDetails.entity_id && activeSub == -1 && {backgroundColor: '#fcdbda'}
                  ]} onPress={() => this.setState({active: active == category.categoryDetails.entity_id ? -1 : category.categoryDetails.entity_id})}>
                    <FallbackImage style={styles.catagoryIcon} source={category.categoryDetails.image_path} />
                    <Text style={styles.catagoryLabel}>{category.categoryDetails.name}</Text>
                    {category.subCategories && <Icon  name={active == category.categoryDetails.entity_id ? 'angle-down' : 'angle-right'} size={dynamicSize(16)} color={Colors.red}/>}
                  </TouchableOpacity>
                  {active == category.categoryDetails.entity_id &&
                    category.subCategories &&
                    Object.keys(category.subCategories).map((key, subIndex) => {
                      const subCategory = category.subCategories[key]
                      return <View key={subCategory.entity_id}>
                        <TouchableOpacity style={[styles.catagoryIten, {borderBottomWidth: 0}, activeSub == subCategory.entity_id && {backgroundColor: '#fcdbda'}]} onPress={() => this.clickSubCat(subCategory)}>
                          <FallbackImage style={[styles.catagoryIcon, {marginLeft: 10}]} source={subCategory.image_path} />
                          <Text style={styles.catagoryLabel}>{subCategory.name}</Text>
                          {subCategory.subCategories && <Icon style={styles.arrowIcon} name={activeSub == subCategory.entity_id ? 'angle-down' : 'angle-right'} size={dynamicSize(16)} color={Colors.red} onPress={() => this.setState({activeSub: activeSub == subCategory.entity_id ? -1 : subCategory.entity_id})}/>}
                        </TouchableOpacity>
                        {activeSub == subCategory.entity_id &&
                          subCategory.subCategories &&
                          Object.keys(subCategory.subCategories).map((key, subIndex) => {
                            const ssubCategory = subCategory.subCategories[key]
                            return <TouchableOpacity key={ssubCategory.entity_id} style={[styles.catagoryIten, {borderBottomWidth: 0}]} onPress={() => this.clickSubCat(ssubCategory)}>
                                <FallbackImage style={[styles.catagoryIcon, {marginLeft: 20}]} source={ssubCategory.image_path} />
                                <Text style={styles.catagoryLabel}>{ssubCategory.name}</Text>
                              </TouchableOpacity>
                          })
                        }
                      </View>
                    })
                  }
                </View>
                : null
            })}
            <View style={styles.blank} />
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  titleBar: {
    paddingVertical: dynamicSize(15),
    paddingHorizontal: dynamicSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  logo: {
    width: dynamicSize(130),
    height: dynamicSize(30),
    resizeMode: 'contain',
  },
  catagoryIten: {
    paddingVertical: dynamicSize(15),
    paddingHorizontal: dynamicSize(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fcdbda',
    borderBottomWidth: 1,
  },
  catagoryIcon: {
    width: dynamicSize(20),
    height: dynamicSize(20),
  },
  catagoryLabel: {
    flex: 1,
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(14),
    color: Colors.red,
  },
  blank: {
    width: '100%',
    height: dynamicSize(5),
    backgroundColor: '#fcdbda',
  },
  arrowIcon: {
    paddingLeft: dynamicSize(20),
    height: '100%',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({ home, user }) => ({
  lang: user.lang,
  headerCategories: home.headerCategories,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainMenu);