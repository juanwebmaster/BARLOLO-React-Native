import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import NavHeader from '../components/NavHeader';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class CustomSliderMarker extends React.Component {
  
  state = {
    showLabel: false,
  }

  setShowLabel = (value) => {
    this.setState({showLabel: value});
  }

  render() {
    const {showLabel} = this.state;
    return (
      <View style={styles.marker}>
        {showLabel && <View style={styles.labelView}>
          <Text >{this.props.currentValue}</Text>
        </View>}
        <TouchableOpacity
          style={styles.toggle}
          onPressIn={() => this.setShowLabel(true)}
          onPressOut={() => this.setShowLabel(false)}
        />
      </View>
    )
  }
}

class Filter extends React.Component {
  constructor(props) {
    super(props);
    const selectedCatFilters = {};
    this.props.selectedCatFilters.map((filter)=>{
      selectedCatFilters[filter.name] = filter;
    })
    this.state = {
      showType: '',
      selectedCatFilters,
      price: this.props.price,
    };
  }

  clear = () => {
    this.setState({
      showType: '',
      selectedCatFilters: {},
      price: [0, 0]
    });
  }

  onApply = () => {
    const {price, selectedCatFilters} = this.state;
    const filters = Object.keys(selectedCatFilters).map((key) => {return {...selectedCatFilters[key], ...{name: key}}});
    this.props.onFilters(price, filters ? filters : []);
  }

  setFilterItem = (filterItem) => {
    const {selectedCatFilters} = this.state;
    this.setState({selectedCatFilters: {...selectedCatFilters, ...filterItem}});
  }

  render() {
    const {navigation, onExit, onFilters, catFilters} = this.props;
    const {showType, price, selectedCatFilters} = this.state;
    return (
      <Fragment>
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Filters')} goBack={onExit} onClear={this.clear}/>
          <View style={styles.slider}>
            <MultiSlider
              sliderLength={SCREEN_WIDTH - 40}
              allowOverlap={true}
              selectedStyle={{
                height: 5,
                backgroundColor: Colors.red,
              }}
              unselectedStyle={{
                height: 5,
                borderRadius: 5,
              }}
              min={0}
              max={100000}
              values={[price[0], price[1]]}
              onValuesChange={(values) => this.setState({price: values})}
              isMarkersSeparated={true}
              customMarkerLeft={(e) => {
                return (<CustomSliderMarker
                  currentValue={e.currentValue}/>)
              }}
              customMarkerRight={(e) => {
                return (<CustomSliderMarker
                  currentValue={e.currentValue}/>)
              }}
            />
            <Text style={styles.priceTxt}>{i18n.t('price_range')}:  {i18n.t('Ks')} {price[0]} - {i18n.t('Ks')} {price[1]}</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
          >
            {Object.keys(catFilters).map((key) => (
              <View key={key} style={styles.catItem}>
                <TouchableOpacity
                  style={styles.catType}
                  onPress={() => this.setState({showType: showType == key ? '' : key})}>
                  <Text style={styles.catLabel}>{key}</Text>
                  <FontAwesomeIcon name={showType == key ? 'angle-down' : 'angle-right'} size={dynamicSize(14)} />
                </TouchableOpacity>
                {showType == key && 
                <View style={styles.optionView}>
                  {catFilters[key].map((item, index) => (
                  <TouchableOpacity key={item.value} style={styles.optBtn} onPress={() => this.setFilterItem({[key]: item})}>
                    <View style={styles.optIcon}>
                      <View style={[styles.optInnerIcon, selectedCatFilters[key] && selectedCatFilters[key].value == item.value && {backgroundColor: Colors.red}]}></View>
                    </View>
                    <Text style={styles.optLabel}>{item.label}</Text>
                  </TouchableOpacity>
                  ))}
                </View>}
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={this.onApply}>
              <Text style={styles.btnLabel}>{i18n.t('Apply')}</Text>
            </TouchableOpacity>
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
    padding: dynamicSize(20),
  },
  marker: {

  },
  toggle: {
    width: dynamicSize(16),
    height: dynamicSize(16),
    borderRadius: dynamicSize(8),
    borderWidth: 1,
    borderColor: '#00000009',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  slider: {
    padding: dynamicSize(20),
  },
  priceTxt: {
    marginLeft: dynamicSize(10),
    fontSize: dynamicSize(15),
    fontWeight: 'bold',
    color: Colors.red,
  },
  catItem: {
    marginBottom: dynamicSize(10),
    paddingHorizontal: dynamicSize(20),
    paddingVertical: dynamicSize(15),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  catType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLabel: {
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  optionView: {
    marginTop: dynamicSize(5),
    paddingVertical: dynamicSize(10),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optIcon: {
    marginVertical: dynamicSize(10),
    marginHorizontal: dynamicSize(20),
    padding: 4,
    width: dynamicSize(25),
    height: dynamicSize(25),
    borderColor: '#999999',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  optInnerIcon: {
    width: '100%',
    height: '100%',
  },
  optLabel: {
    fontSize: 14,
    color: '#999999',
  },
  button: {
    marginVertical: dynamicSize(20),
    width: '100%',
    paddingVertical: dynamicSize(15),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    fontSize: dynamicSize(15),
    color: 'white',
  },
});

const mapStateToProps = ({ auth, user, category }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  catFilters: category.catFilters,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filter);