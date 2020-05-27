import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import { checkAuth, fetchAdminToken } from '../store/actions/auth';
import { setRedirectLink } from '../store/actions/loading';
import {
	fetchCarts,
	createCart,
	deleteItem,
} from '../store/actions/cart';

import CartService from '../services/CartService.js';

import FallbackImage from './FallbackImage';
import LoadingComponent from './LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import { SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize } from '../config';

class CartItemList extends React.Component {
	state = {
		isLoading: false,
		coupon_code: '',
		couponModalShow: false,
		modalMessage: '',
	}

	gotoStore = (id) => {
		this.props.navigation.navigate('StoreShow', { id });
	}

	gotoProduct = (id, sku) => {
		this.props.navigation.navigate('ProductShow', { id, sku });
	}

	deleteItem = (cart) => {
		this.setState({ isLoading: true });
		this.props.deleteItem({
			quoteId: this.props.carts.quote_id,
			itemId: cart.item_id
		})
			.then(() => {
				this.props.fetchCarts(this.props.userId)
					.then(() => {
						this.setState({ isLoading: false });
					})
			})
			.catch(() => {
				this.setState({ isLoading: false });
			})
	}

	changeQty(cart, qty) {
		this.setState({ isLoading: true });
		this.props.createCart({
			item_id: cart.item_id,
			sku: cart.sku,
			qty: qty,
			quote_id: this.props.carts.quote_id
		})
			.then(() => {
				this.props.fetchCarts(this.props.userId)
					.then(() => {
						this.setState({ isLoading: false });
					})
			})
			.catch(() => {
				this.setState({ isLoading: false });
			})
	}

	increaseQty = (cart) => {
		this.changeQty(cart, (cart.qty + 1))
	}

	decreaseQty = (cart) => {
		this.changeQty(cart, (cart.qty - 1))
	}

	onclickOrder = () => {
		this.props.navigation.navigate('OrderConfirmation');
	}

	onclickContinue = () => {
		this.props.navigation.navigate('Home');
	}

	hasCupon() {
		const { carts } = this.props;
		return (
			carts.discount_amount &&
			+carts.discount_amount.replace(/[^0-9]/g, '') > 0
		)
	}

	applyCoupon = () => {
		this.setState({ isLoading: true });
		CartService.applyCoupon(this.props.carts.quote_id, this.state.coupon_code)
			.then(response => {
				if (response.data == true) {
					this.props.fetchCarts(this.props.userId)
						.then(() => {
							this.setState({ 
								isLoading: false,
								couponModalShow: true,
								modalMessage: 'Your coupon was successfully applied.',
							});
						})
				}
			})
			.catch(error => {
				this.setState({ 
					isLoading: false,
					couponModalShow: true,
					modalMessage: error.response.data.message,
				});
			})
	}

	removeCoupon = () => {
		this.setState({ isLoading: true });
		CartService.removeCoupon(this.props.carts.quote_id)
			.then(response => {
				if (response.data == true) {
					this.props.fetchCarts(this.props.userId)
						.then(() => {
							this.setState({ 
								isLoading: false, 
								coupon_code: '',
								couponModalShow: true,
								modalMessage: 'Your coupon was successfully removed.',
							});
						})
				}
			})
			.catch(error => {
				this.setState({ 
					isLoading: false,
					couponModalShow: true,
					modalMessage: error.response.data.message,
				});
			})
	}

	_renderEmpty = () => {
		return (
			<View style={styles.itemEmpty}>
				<Image style={styles.emptyImg} source={require('../assets/img/shopping-cart.png')} />
				<Text style={styles.emptyTxt}>{i18n.t('cart_empty')}</Text>
			</View>
		);
	}

	_renderItem = ({ item, index }) => {
		const { store_id, shop_title, product_id, sku, image, name, product_price, weight, qty, price, config_option } = item;
		return (
			<View style={styles.cardItem}>
				<View style={styles.storeInfo}>
					{store_id ?
						<TouchableOpacity onPress={() => this.gotoStore(store_id)}>
							<Text style={styles.storeName}>{i18n.t('Seller')}:  <Text style={{ fontWeight: 'normal' }}>{shop_title}</Text></Text>
						</TouchableOpacity> :
						<Text style={styles.storeName}>{i18n.t('offical_store')}</Text>}
					<TouchableOpacity onPress={() => this.deleteItem(item)}>
						<FontAwesomeIcon name='trash' size={dynamicSize(18)} color={Colors.red} />
					</TouchableOpacity>
				</View>
				<View style={styles.cardBody}>
					<TouchableOpacity onPress={() => this.gotoProduct(product_id, sku)}>
						<FallbackImage style={styles.image} source={image} />
					</TouchableOpacity>
					<View style={styles.cartInfo}>
						<View style={{ flex: 1 }}>
							<Text style={styles.productName} onPress={() => this.gotoProduct(product_id, sku)}>
								{name}
							</Text>
							<View style={styles.qtyBox}>
								<View style={{ flex: 1 }}>
									<Text style={styles.price}>{product_price}</Text>
									<Text style={styles.productName}>{i18n.t('Weight')}: {weight} kg</Text>
								</View>
								<View style={[styles.qtyBox, { width: dynamicSize(100) }]}>
									<TouchableOpacity style={styles.qtyBtn} disabled={qty == 1} onPress={() => this.decreaseQty(item)}>
										<Icon name='minus' size={dynamicSize(15)} />
									</TouchableOpacity>
									<Text>{qty}</Text>
									<TouchableOpacity style={styles.qtyBtn} onPress={() => this.increaseQty(item)}>
										<Icon name='plus' size={dynamicSize(15)} />
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.options}>
								{config_option && config_option.map((option, index) => (
									<View key={index} style={styles.option}>
										<Text style={styles.optionLabel}>{option.label}</Text>
										<Text style={styles.optionLabel}>{option.value}</Text>
									</View>
								))}
							</View>
						</View>
						<View style={styles.totalBox}>
							<Text style={styles.total}>{i18n.t('Subtotal')}</Text>
							<Text style={styles.totalPrice}>{price}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}

	render() {
		const { carts, cartItems } = this.props;
		const { isLoading, coupon_code, couponModalShow, modalMessage } = this.state;
		return (
			<KeyboardAvoidingView style={styles.container}>
				<FlatList
					ref={ref => {
						this.listRef = ref;
					}}
					data={cartItems}
					renderItem={this._renderItem}
					ListEmptyComponent={this._renderEmpty}
					keyExtractor={(item, index) => item.product_id + ':' + index}
					ListFooterComponent={<View style={{ height: dynamicSize(10) }} />}
					nestedScrollEnabled={true}
					removeClippedSubviews={true}
				/>
				{cartItems.length > 0 ?
					<View style={styles.orderView}>
						<View style={styles.seperator} />
						<View style={styles.rowStyle}>
							<Image style={styles.couponIcon} source={require('../assets/img/promo.png')} />
							<TextInput
								style={styles.textInput}
								placeholder={i18n.t('Enter discount code')}
								placeholderTextColor={Colors.placeholder}
								autoCapitalize="none"
								keyboardType="email-address"
								editable={!this.hasCupon()}
								onChangeText={(text) => { this.setState({ coupon_code: text.replace(/\s/g, '') }); }}
								value={coupon_code}
								underlineColorAndroid="transparent"
							/>
							{this.hasCupon() ?
								<TouchableOpacity style={styles.couponBtn} onPress={this.removeCoupon}>
									<Text style={styles.btnLabel}>{i18n.t('Remove')}</Text>
								</TouchableOpacity> :
								<TouchableOpacity style={styles.couponBtn} onPress={this.applyCoupon}>
									<Text style={styles.btnLabel}>{i18n.t('Apply')}</Text>
								</TouchableOpacity>}
						</View>
						<View style={styles.seperator} />
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('Price')}:</Text>
							<Text style={styles.label}>{carts.subTotal}</Text>
						</View>
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('delivery_charges')}:</Text>
							<Text style={styles.label}>{carts.shipping}</Text>
						</View>
						{+carts.discount_amount.replace(/[^0-9]/g, '') > 0 &&
							<View style={styles.rowStyle}>
								<Text style={styles.label}>{i18n.t('Discount')} - <Text style={{ fontWeight: 'bold' }}>{carts.coupon_code}</Text>:</Text>
								<Text style={styles.label}>{carts.discount_amount}</Text>
							</View>}
						<View style={styles.seperator} />
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('amount_payable')}:</Text>
							<Text style={styles.label}>{carts.grandTotal}</Text>
						</View>
						<TouchableOpacity style={styles.button} onPress={this.onclickOrder}>
							<Text style={styles.btnLabel}>{i18n.t('Checkout')}</Text>
						</TouchableOpacity>
					</View> :
					<TouchableOpacity style={styles.button} onPress={this.onclickContinue}>
						<Text style={styles.btnLabel}>{i18n.t('continue_shopping')}</Text>
					</TouchableOpacity>
				}
				<LoadingComponent visible={isLoading} />
				<Modal
					isVisible={couponModalShow}
					onBackButtonPress={() => this.setState({ couponModalShow: false })}
					onBackdropPress={() => this.setState({ couponModalShow: false })}
					style={styles.modalContainer}
				>
					<View style={styles.modalContent}>
						<View style={styles.modalContentHeader}>
							<Text style={styles.modalHeaderText}>Alert</Text>
							<TouchableOpacity onPress={() => this.setState({ couponModalShow: false })}>
								<FontAwesomeIcon name="close" size={20} color={Colors.white} />
							</TouchableOpacity>
						</View>
						<View style={styles.modalContentMain}>
							<Text style={styles.modalContentText}>{modalMessage}</Text>
						</View>
					</View>
				</Modal>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardItem: {
		width: SCREEN_WIDTH,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.borderColor,
		marginBottom: dynamicSize(10),
	},
	storeInfo: {
		paddingHorizontal: dynamicSize(10),
		paddingVertical: dynamicSize(5),
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: Colors.borderColor,
	},
	storeName: {
		flex: 1,
		fontSize: dynamicSize(13),
		fontWeight: 'bold',
		color: Colors.black,
	},
	cardBody: {
		padding: dynamicSize(10),
		flexDirection: 'row',
	},
	image: {
		width: dynamicSize(125),
		height: dynamicSize(125),
		resizeMode: 'contain'
	},
	cartInfo: {
		flex: 1,
		marginLeft: dynamicSize(10),
		justifyContent: 'space-between',
	},
	productName: {
		fontSize: dynamicSize(13),
		color: Colors.black,
	},
	qtyBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	price: {
		fontSize: dynamicSize(14),
		color: Colors.red,
	},
	totalBox: {
		marginBottom: dynamicSize(10),
		paddingVertical: dynamicSize(5),
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderColor: '#999999',
	},
	total: {
		fontSize: dynamicSize(13),
		fontWeight: 'bold',
		color: Colors.red,
	},
	totalPrice: {
		fontSize: dynamicSize(14),
		fontWeight: 'bold',
		color: '#999999',
	},
	itemEmpty: {
		alignSelf: 'center',
		alignItems: 'center',
	},
	emptyImg: {
		width: dynamicSize(100),
		height: dynamicSize(100),
	},
	emptyTxt: {
		fontSize: dynamicSize(13),
		color: '#212529'
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
	qtyBtn: {
		width: dynamicSize(26),
		height: dynamicSize(26),
		borderRadius: dynamicSize(13),
		borderColor: Colors.gray,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	orderView: {
		width: '100%',
	},
	discountCode: {
		paddingVertical: dynamicSize(5),
		paddingHorizontal: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.borderColor,
	},
	rowStyle: {
		paddingVertical: dynamicSize(5),
		paddingHorizontal: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	seperator: {
		width: '100%',
		borderTopWidth: 1,
		borderColor: Colors.borderColor,
	},
	label: {
		fontSize: dynamicSize(14),
		color: '#666666',
	},
	couponIcon: {
		width: dynamicSize(40),
		height: dynamicSize(20),
		resizeMode: 'contain',
	},
	couponBtn: {
		paddingVertical: dynamicSize(5),
		paddingHorizontal: dynamicSize(20),
		alignItems: 'center',
		backgroundColor: Colors.red,
	},
	textInput: {
		flex: 1,
		marginLeft: dynamicSize(10),
		paddingVertical: 0,
		fontSize: dynamicSize(14),
	},
	options: {
		paddingVertical: dynamicSize(10),
		paddingRight: dynamicSize(10),
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	optionLabel: {
		fontSize: dynamicSize(11),
		color: '#666666'
	},
	modalContainer: {
		alignItems: 'center',
	},
	modalContent: {
		width: SCREEN_WIDTH * 0.9,
		borderRadius: dynamicSize(6),
		overflow: 'hidden',
	},
	modalContentHeader: {
		flexDirection: 'row',
		backgroundColor: Colors.red,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	modalHeaderText: {
		color: Colors.white,
		fontSize: dynamicSize(20),
		fontWeight: 'bold',
	},
	modalContentMain: {
		backgroundColor: Colors.white,
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	modalContentText: {
		color: Colors.black,
		fontSize: dynamicSize(16),
	}
});

const mapStateToProps = ({ auth, user, cart }) => ({
	isLogged: auth.isLogged,
	userId: auth.user.id,
	lang: user.lang,
	carts: cart.carts,
	cartItems: cart.cartItems,
});

const mapDispatchToProps = {
	checkAuth,
	fetchAdminToken,
	setRedirectLink,
	fetchCarts,
	createCart,
	deleteItem,
};

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CartItemList);