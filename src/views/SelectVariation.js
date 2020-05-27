import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {fetchCarts} from '../store/actions/product';
import {
  addToCartItem,
  fetchQuote,
} from '../store/actions/cart';
import {setRedirectLink} from '../store/actions/loading';

import ToggleBack from "../components/toggle/ToggleBack";
import ToggleCart from "../components/toggle/ToggleCart";
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {dynamicSize} from '../config';

class SelectVariation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      myImage: '',
      selected: [],
      qty: 1,
    };

    this.focusListener = props.navigation.addListener('didFocus', ({state, action}) => {
      const {product} = this.props;
      this.setState({
        isLoading: false,
        myImage: product.product_images??product.product_images[0],
        selected: [],
        qty: 1,
      });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  selectItem(index, subIndex, image) {
    const {selected} = this.state;
    selected[index] = subIndex;
    this.setState({selected, myImage: image??image});
  }

  increaseQty = () => {
    this.setState({qty: this.state.qty + 1});
  }

  decreaseQty = () => {
    this.setState({qty: this.state.qty - 1});
  }

  handleIsNotLoggedIn = () => {
    this.props.setRedirectLink(this.props.navigation.state.routeName)
    this.props.navigation.navigate('Login');
  }

  onclickAdd = () => {
    const {isLogged, skuProduct, skuOfProduct, user} = this.props;
    const {qty, selected} = this.state;
    if (!isLogged) {
      return this.handleIsNotLoggedIn()
    }

    this.setState({isLoading: true});
    const options = skuOfProduct.extension_attributes.configurable_product_options;
    const custom_attributes = selected.map((item, index) => {
      return {
        option_id: options[index].attribute_id,
        option_value: options[index].values[item].value_index,
      };
    })

    this.props.addToCartItem({
      sku: skuProduct.sku,
      qty,
      product_option: {
        extension_attributes: {
          configurable_item_options: custom_attributes,
        }
      }
    })
    .then(res => {
      this.props.fetchCarts(user.id)
			.then(() => {
        Alert.alert('','Added to Cart.');
        this.props.fetchQuote();
				this.setState({isLoading: false});
			})
    })
    .catch(e => {
      console.log(e);
      this.setState({isLoading: false});
    })
  }

  render() {
    const {navigation, skuOfProduct} = this.props;
    const {isLoading, myImage, selected, qty} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.imageBox}>
              <FallbackImage style={styles.productImg} source={myImage} />
              <View style={styles.subimgs}>
                <FallbackImage style={styles.subProductImg} source={myImage} />
              </View>
              <ToggleBack style={styles.toggleBack} navigation={navigation} />
              <ToggleCart style={styles.toggleCart} navigation={navigation} />
            </View>
            {skuOfProduct.extension_attributes?.configurable_product_options?.map((option, index) => (
              <View key={index} style={styles.rowStyle}>
                <Text style={styles.title}>{option.label}</Text>
                <View style={styles.items}>
                  {option.values.map((attribute, subIndex) => (
                    <TouchableOpacity key={subIndex} style={[styles.selectItem, selected[index] == subIndex && {backgroundColor: Colors.red}]} onPress={() => this.selectItem(index, subIndex, attribute.image)}>
                      <Text style={[styles.label, selected[index] == subIndex && {color: 'white'}]}>{attribute.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            <View style={styles.selectQtyBox}>
              <Text style={styles.title}>{i18n.t('Select_Quantity')}:</Text>
              <View style={styles.qtyBox}>
                <TouchableOpacity style={styles.qtyBtn} disabled={qty < 2} onPress={this.decreaseQty}>
                  <Icon name='minus' size={dynamicSize(15)}/>
                </TouchableOpacity>
                <Text>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={this.increaseQty}>
                  <Icon name='plus' size={dynamicSize(15)}/>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
					<TouchableOpacity style={styles.button} onPress={this.onclickAdd}>
						<Text style={styles.btnLabel}>{i18n.t('Add to Cart')}</Text>
					</TouchableOpacity>
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    width: '100%',
  },
  productImg: {
    width: '100%',
    height: dynamicSize(200),
    resizeMode: 'contain',
  },
  subimgs: {
    padding: dynamicSize(10),
  },
  subProductImg: {
    margin: dynamicSize(10),
    width: dynamicSize(80),
    height: dynamicSize(80),
    resizeMode: 'contain',
  },
  toggleBack: {
    position: 'absolute',
    top: dynamicSize(20),
    left: dynamicSize(20),
  },
  toggleCart: {
    position: 'absolute',
    top: dynamicSize(20),
    right: dynamicSize(20),
  },
  rowStyle: {
    paddingTop: dynamicSize(10),
    paddingLeft: dynamicSize(10),
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
  title: {
    fontSize: dynamicSize(15),
    color: '#212529',
  },
  items: {
    paddingTop: dynamicSize(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectItem: {
    marginRight: dynamicSize(10),
    marginBottom: dynamicSize(10),
    paddingHorizontal: dynamicSize(15),
    paddingVertical: dynamicSize(10),
    backgroundColor: '#F1F1F1',
  },
  label: {
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  selectQtyBox: {
    padding: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
	qtyBox: {
    minWidth: dynamicSize(80),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	qtyBtn: {
		width: dynamicSize(26),
		height: dynamicSize(26),
		borderRadius: dynamicSize(13),
		borderColor: Colors.gray,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		width: '100%',
		paddingVertical: dynamicSize(15),
		alignItems: 'center',
		backgroundColor: Colors.red,
	},
	btnLabel: {
		fontSize: dynamicSize(16),
		fontWeight: 'bold',
		color: 'white',
	},
});

const mapStateToProps = ({ auth, user, product }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  product: product.product[0] ? product.product[0] : {},
  skuOfProduct: product.skuOfProduct,
  skuProduct: product.skuProduct,
});

const mapDispatchToProps = {
  addToCartItem,
  fetchCarts,
  fetchQuote,
  setRedirectLink,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectVariation);
