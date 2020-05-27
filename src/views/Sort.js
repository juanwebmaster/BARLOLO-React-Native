import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import NavHeader from '../components/NavHeader';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, dynamicSize} from '../config';

class Sort extends React.Component {
  render() {
    const {navigation, onExit, onSortBy, catSorts} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Sort')} goBack={onExit}/>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
          >
            {catSorts.map((catItem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.catItem}
              onPress={() => onSortBy({
                name: catItem.value,
                direction: catItem.direction, 
            })}>
              <Text style={styles.btnLabel}>{catItem.label}</Text>
            </TouchableOpacity>))}
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentStyle: {
    padding: 20,
  },
  catItem: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  btnLabel: {
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
});

const mapStateToProps = ({ auth, user, category }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  catSorts: category.catSorts,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sort);