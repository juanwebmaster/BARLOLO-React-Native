import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
	KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';

import { checkAuth, fetchAdminToken } from '../store/actions/auth';
import { setRedirectLink } from '../store/actions/loading';

import FallbackImage from './FallbackImage';

import i18n from "@app/locale/i18n";
import config from '@app/config/config';
import Colors from '@app/config/colors';
import { SCREEN_WIDTH, dynamicSize } from '../config';

class BuyerCompleteItemList extends React.Component {

	gotoStore = (id) => {
		this.props.navigation.navigate('StoreShow', { id });
	}

	gotoProduct = (id, sku) => {
		this.props.navigation.navigate('ProductShow', { id, sku });
	}

	itemCount() {
		if (this.props.purchaseHistory.total.review) {
			return this.props.purchaseHistory.total.review.items_count
		}
	}

	subTotalCount() {
		if (this.props.purchaseHistory.total.review) {
			return this.props.purchaseHistory.total.review.subtotal_count
		}
	}

	rateProduct = () => {
		const {navigation} = this.props;
		//let supportId = config.get('APP_SUPPORT_CHAT_UNIQUE_ID');
		navigation.navigate('MyReviews');
	}

	_renderEmpty = () => {
		return (
			<View style={styles.itemEmpty}>
				<Image style={styles.emptyImg} source={require('../assets/img/no-item.png')} />
				<Text style={styles.emptyTxt}>{i18n.t('No Item')}</Text>
			</View>
		);
	}

	_renderItem = ({ item, index }) => {
		const { seller_id, seller, ordernumber, id, sku, image, name, price, weight, qty, grand_total_with_cur, config_option } = item;
		return (
			<View style={styles.cardItem}>
				<View style={styles.storeInfo}>
					{seller_id ?
						<TouchableOpacity onPress={() => this.gotoStore(seller_id)}>
							<Text style={styles.storeName}>{i18n.t('Seller')}:  <Text style={{ fontWeight: 'normal' }}>{seller}</Text></Text>
						</TouchableOpacity> :
						<Text style={styles.storeName}>{i18n.t('offical_store')}</Text>}
					<Text style={styles.ordernumber}>{ordernumber}</Text>
				</View>
				<View style={styles.cardBody}>
					<TouchableOpacity onPress={() => this.gotoProduct(id, sku)}>
						<FallbackImage style={styles.image} source={image} />
					</TouchableOpacity>
					<View style={styles.cartInfo}>
						<View style={{ flex: 1 }}>
							<Text style={styles.productName} onPress={() => this.gotoProduct(id, sku)}>
								{name}
							</Text>
							<View style={styles.qtyBox}>
								<View style={{ flex: 1 }}>
									<Text style={styles.price}>{price}</Text>
									<Text style={styles.productName}>{i18n.t('Weight')}: {weight} kg</Text>
								</View>
								<View style={styles.qtyBox}>
									<Text style={styles.totalPrice}>X {qty}</Text>
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
							<Text style={styles.totalPrice}>{grand_total_with_cur}</Text>
						</View>
					</View>
				</View>
				<View style={styles.footer}>
					<Text style={styles.label}>{'Complete'}</Text>
					<TouchableOpacity style={styles.contactBtn} onPress={this.rateProduct}>
						<Text style={styles.contactBtnLabel}>{i18n.t('Rate Product')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	render() {
		const { purchaseHistory } = this.props;
		return (
			<KeyboardAvoidingView style={styles.container}>
				<FlatList
					ref={ref => {
						this.listRef = ref;
					}}
					data={purchaseHistory.review}
					renderItem={this._renderItem}
					ListEmptyComponent={this._renderEmpty}
					keyExtractor={(item, index) => item.ordernumber + ':' + index}
					ListFooterComponent={<View style={{ height: dynamicSize(10) }} />}
					nestedScrollEnabled={true}
					removeClippedSubviews={true}
				/>
				{purchaseHistory.total?.review && <View style={styles.button} onPress={this.onclickContinue}>
					<Text style={styles.btnLabel}>{this.itemCount()} {i18n.t('Items')}:</Text>
					<Text style={styles.btnLabel}>{i18n.t('Total Payment')}: {this.subTotalCount()}</Text>
				</View>}
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
	ordernumber: {
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
		paddingHorizontal: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Colors.red,
	},
	btnLabel: {
		fontSize: dynamicSize(16),
		fontWeight: 'bold',
		color: 'white',
	},
	footer: {
		marginHorizontal: dynamicSize(10),
		paddingVertical: dynamicSize(10),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#d7d7d7',
		borderTopWidth: 1,
	},
	label: {
		flex: 1,
		fontSize: dynamicSize(14),
		color: '#212529',
	},
	contactBtn: {
		padding: dynamicSize(10),
		marginHorizontal: dynamicSize(15),
		backgroundColor: Colors.red,
		borderRadius: 6,
		borderColor: '#dc3545',
		borderWidth: 1,
	},
	contactBtnLabel: {
		fontSize: dynamicSize(14),
		color: 'white',
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
});

const mapStateToProps = ({ auth, user, merchant }) => ({
	isLogged: auth.isLogged,
	userId: auth.user.id,
	lang: user.lang,
	purchaseHistory: merchant.purchaseHistory,
});

const mapDispatchToProps = {
	checkAuth,
	fetchAdminToken,
	setRedirectLink,
};

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps,
)(BuyerCompleteItemList);