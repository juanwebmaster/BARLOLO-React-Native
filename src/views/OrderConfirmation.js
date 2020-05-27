import React, { Fragment } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	StatusBar,
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import { checkAuth, fetchAdminToken } from '../store/actions/auth';
import { setRedirectLink } from '../store/actions/loading';
import {
	fetchCarts,
	createOrder,
} from '../store/actions/cart';
import { makeDefaultAddress } from '../store/actions/user';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import { SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize } from '../config';

class OrderConfirmation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			selectModalShown: false,
		};

		const { navigation } = this.props;
		this.focusListener = navigation.addListener('didFocus', ({ state, action }) => {
			if (action.type === 'Navigation/BACK') {
				return;
			}
			this.setState({ isLoading: true });
			Promise.all([
				this.props.checkAuth(),
				this.props.fetchAdminToken(),
			]).then(() => {
				const { routeName, params } = state;
				if (params && params.requiresAuth && !this.props.isLogged) {
					this.setState({ isLoading: false });
					this.props.setRedirectLink(routeName);
					navigation.goBack();
					navigation.navigate('Login');
					return;
				}
				this.props.fetchCarts(this.props.userId)
					.then(() => {
						this.setState({ isLoading: false });
					})
			})
				.catch(error => {
					this.setState({ isLoading: false });
					navigation.goBack();
				})
		});
	}

	componentWillUnmount() {
		// Remove the event listener
		this.focusListener.remove();
	}

	createOrder(cart) {
		const {defaultAddress, userId, userEmail} = this.props;
		if (!defaultAddress) {
			this.setState({
				selectModalShown: true,
			});
			return;
		}
		this.setState({isLoading: true});
		const paymentCode = cart.payment_method[0].value;

		if (paymentCode) {
			const data = {
				customer_id: userId,
				shipping_address_id: defaultAddress.id,
				payment_method_code: paymentCode
			}
			const address = {
				customer_id: userId,
				email: userEmail,
				address: {
					address_id: defaultAddress.id,
					default_billing: 1,
					default_shipping: 1
				}
			}
			Promise.all([
				this.props.createOrder({
					data,
					recipientInfo: defaultAddress,
				}),
				this.props.fetchCarts(this.props.userId),
				this.props.makeDefaultAddress(address),
			])
				.then(response => {
					this.setState({isLoading: false});
					this.props.navigation.goBack();
					this.props.navigation.goBack();
					this.props.navigation.navigate('OrderSummary');
				})
				.catch(({ response }) => {
					this.setState({isLoading: false});
				})
		} else {
			this.setState({isLoading: false});
			return (alert(i18n.t('payment_option')));
		}
	}

	gotoStore = (id) => {
		this.props.navigation.navigate('StoreShow', { id });
	}

	gotoProduct = (id, sku) => {
		this.props.navigation.navigate('ProductShow', { id, sku });
	}

	onclickOrder = () => {
		this.createOrder(this.props.carts);
	}

	onclickContinue = () => {
		this.props.navigation.navigate('Home');
	}

	gotoAddressList = () => {
		this.props.navigation.navigate('MyAddress', { from: 'Cart' });
	}

	_renderItem = (item, index) => {
		const { store_id, shop_title, product_id, sku, image, name, product_price, weight, qty, price } = item;
		return (
			<View key={product_id} style={styles.cardItem}>
				<View style={styles.storeInfo}>
					{store_id ?
						<TouchableOpacity onPress={() => this.gotoStore(store_id)}>
							<Text style={styles.storeName}>{i18n.t('Seller')}:  <Text style={{ fontWeight: 'normal' }}>{shop_title}</Text></Text>
						</TouchableOpacity> :
						<Text style={styles.storeName}>{i18n.t('offical_store')}</Text>}
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
								<View style={styles.qtyBox}>
									<Text style={styles.totalPrice}>X {qty}</Text>
								</View>
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
		const { navigation, carts, cartItems, defaultAddress } = this.props;
		const { isLoading, selectModalShown } = this.state;
		return (
			<Fragment>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView style={styles.container}>
					<NavHeader navigation={navigation} title={i18n.t('Cart')} />
					<ScrollView>
						<View style={styles.subTitleBar}>
							<View style={styles.subNubView}>
								<Text style={styles.subNub}>1</Text>
							</View>
							<Text style={styles.subTitle}>{i18n.t('Order Summary')}</Text>
						</View>
						{cartItems.map(this._renderItem)}
						<View style={styles.subTitleBar}>
							<View style={styles.subNubView}>
								<Text style={styles.subNub}>2</Text>
							</View>
							<Text style={styles.subTitle}>{i18n.t('delivery_address')}</Text>
						</View>
						<View style={styles.addressView}>
							<Image style={styles.addressImg} source={require('../assets/img/address.png')} />
							{defaultAddress && (
								<View style={styles.addressInfo} >
									<Text style={styles.addressTitle}>{ defaultAddress.firstname } { defaultAddress.lastname }</Text>
									<View style={styles.rowStyle}>
										<FontAwesomeIcon style={{alignSelf: 'flex-start', marginTop: dynamicSize(5)}} name='map-marker' size={dynamicSize(15)} color='#666666' />
										<View style={styles.addressBox}>
											<Text style={styles.addresslabel}>{defaultAddress.street && defaultAddress.street[0]}</Text>
											<Text style={styles.addresslabel}>{defaultAddress.city}, {defaultAddress.region?.region}</Text>
											<Text style={styles.addresslabel}>{defaultAddress.country_id}</Text>
										</View>
									</View>
									<View style={styles.rowStyle}>
										<FontAwesomeIcon name='phone' size={dynamicSize(15)} color='#666666' />
										<Text style={styles.addresslabel}>{defaultAddress.telephone}</Text>
									</View>
								</View>
							)}
							<TouchableOpacity style={{alignSelf: 'center'}} onPress={this.gotoAddressList}>
								<Icon name='angle-right' size={dynamicSize(20)} color={Colors.red} />
							</TouchableOpacity>
						</View>
						<View style={styles.subTitleBar}>
							<View style={styles.subNubView}>
								<Text style={styles.subNub}>3</Text>
							</View>
							<Text style={styles.subTitle}>{i18n.t('payment_option')}</Text>
							<Text style={styles.paymentLabel}>{carts?.payment_method[0]?.label}</Text>
						</View>
					</ScrollView>
					<View style={styles.orderView}>
						<View style={styles.seperator} />
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('Price')}:</Text>
							<Text style={styles.label}>{carts.subTotal}</Text>
						</View>
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('delivery_charges')}:</Text>
							<Text style={styles.label}>{carts.shipping}</Text>
						</View>
						{+carts.discount_amount?.replace(/[^0-9]/g, '') > 0 &&
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
					</View>
					<LoadingComponent visible={isLoading} />
					<Modal
						isVisible={selectModalShown}
						onBackButtonPress={() => this.setState({ selectModalShown: false })}
						onBackdropPress={() => this.setState({ selectModalShown: false })}
						style={styles.selectModalContainer}
					>
						<View style={styles.selectModalContent}>
							<View style={styles.selectModalContentHeader}>
								<Text style={styles.selectModalHeaderText}>
									{i18n.t('select_address')}
								</Text>
								<TouchableOpacity onPress={() => this.setState({ selectModalShown: false })}>
									<FontAwesomeIcon name="close" size={20} color={Colors.white} />
								</TouchableOpacity>
							</View>
							<View style={styles.selectModalContentMain}>
								<Text style={styles.selectModalContentText}>{i18n.t('Delivery Address is required')}</Text>
							</View>
						</View>
					</Modal>
				</SafeAreaView>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	subTitleBar: {
		paddingVertical: dynamicSize(5),
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.borderColor,
		marginBottom: dynamicSize(10),
		flexDirection: 'row',
		alignItems: 'center',
	},
	subNubView: {
		marginHorizontal: dynamicSize(10),
		width: dynamicSize(24),
		height: dynamicSize(24),
		borderRadius: dynamicSize(12),
		borderWidth: 2,
		borderColor: Colors.red,
		justifyContent: 'center',
		alignItems: 'center',
	},
	subNub: {
		fontSize: dynamicSize(13),
		fontWeight: 'bold',
		color: Colors.red,
	},
	subTitle: {
		fontSize: dynamicSize(15),
		fontWeight: 'bold',
		color: '#8D8B8B',
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
	addressView: {
		padding: dynamicSize(10),
		marginBottom: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: Colors.borderColor,
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	addressImg: {
		width: dynamicSize(60),
		height: dynamicSize(65),
		resizeMode: 'contain',
	},
	addressInfo: {
		flex: 1,
		marginLeft: dynamicSize(20),
	},
	addressBox: {
		flex: 1,
	},
	addressTitle: {
		marginLeft: dynamicSize(10),
		fontSize: dynamicSize(15),
		fontWeight: 'bold',
		color: '#6E6E6E',
	},
	addresslabel: {
		flex: 1,
		marginLeft: dynamicSize(10),
		fontSize: dynamicSize(14),
		color: '#6E6E6E',
	},
	paymentLabel: {
		position: 'absolute',
		right: dynamicSize(10),
		fontSize: dynamicSize(15),
		color: '#666666',
	},
	selectModalContainer: {
		alignItems: 'center',
	},
	selectModalContent: {
		width: SCREEN_WIDTH * 0.9,
		borderRadius: dynamicSize(6),
		overflow: 'hidden',
	},
	selectModalContentHeader: {
		flexDirection: 'row',
		backgroundColor: Colors.red,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	selectModalHeaderText: {
		color: Colors.white,
		fontSize: dynamicSize(18),
	},
	selectModalContentMain: {
    	flexDirection: 'row',
		backgroundColor: Colors.white,
		paddingHorizontal: dynamicSize(17),
		paddingVertical: dynamicSize(15),
	},
	selectModalContentText: {
		color: Colors.black,
		fontSize: dynamicSize(16),
  	},
});

function shippingAddress(addresses) {
	let defaultAddress = addresses.find(address => {
		return address.default_shipping;
	})

	if (!!defaultAddress) {
		return defaultAddress;
	} else {
		return _.last(addresses);
	}
}

const mapStateToProps = ({ auth, user, cart }) => ({
	isLogged: auth.isLogged,
	userId: auth.user.id,
	userEmail: user.user.email,
	lang: user.lang,
	carts: cart.carts,
	cartItems: cart.cartItems,
	defaultAddress: (user.user.addresses && user.user.addresses.length) 
		? shippingAddress(user.user.addresses) : null,
});

const mapDispatchToProps = {
	checkAuth,
	fetchAdminToken,
	setRedirectLink,
	fetchCarts,
	createOrder,
	makeDefaultAddress,
};

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps,
)(OrderConfirmation);