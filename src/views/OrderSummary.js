import React, { Fragment } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	StatusBar,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import NavHeader from '../components/NavHeader';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import { dynamicSize } from '../config';

class OrderSummary extends React.Component {
	onclickContinue = () => {
		this.props.navigation.goBack();
		this.props.navigation.navigate('Home');
	}

	render() {
		const { navigation, order,  recipientInfo } = this.props;
		return (
			<Fragment>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView style={styles.container}>
					<NavHeader navigation={navigation} title={i18n.t('Order Summary')} isBack={false}/>
					<View style={styles.body}>
						<Image style={styles.image} source={require('../assets/img/success1.png')} />
						<Text style={styles.title}>{i18n.t('thank_you_order')}</Text>
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('your_order')}:</Text>
							<View style={{flex: 1}}>
								<Text style={styles.value}>{order.real_order_id}</Text>
							</View>
						</View>
						<View style={styles.rowStyle}>
							<Text style={styles.label}>{i18n.t('reception_info')}:</Text>
							<View style={{flex: 1}}>
								<Text style={styles.value}>{recipientInfo.firstname} {recipientInfo.lastname}</Text>
								<Text style={styles.value}>{recipientInfo.telephone}</Text>
								<Text style={styles.value}>{recipientInfo.street && recipientInfo.street[0]}</Text>
								<Text style={styles.value}>{recipientInfo.city} {recipientInfo.region?.region}</Text>
								<Text style={styles.value}>{recipientInfo.country_id}</Text>
							</View>
						</View>
						<Text style={[styles.label, {textAlign: 'left', alignSelf: 'flex-start'}]}>{i18n.t('contact_delivery')}</Text>
					</View>
					<TouchableOpacity style={styles.button} onPress={this.onclickContinue}>
						<Text style={styles.btnLabel}>{i18n.t('continue_shopping')}</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	body: {
		flex: 1,
		paddingHorizontal: dynamicSize(10),
		alignItems: 'center',
	},
	image: {
		width: dynamicSize(100),
		height: dynamicSize(120),
	},
	title: {
		paddingVertical: dynamicSize(5),
		fontSize: dynamicSize(18),
		color: '#212529',
	},
	rowStyle: {
		width: '100%',
		paddingVertical: dynamicSize(10),
		flexDirection: 'row',
	},
	label: {
		flex: 1,
		textAlign: 'right',
		fontSize: dynamicSize(13),
		color: '#212529',
	},
	value: {
		marginLeft: dynamicSize(20),
		fontSize: dynamicSize(13),
		fontWeight: 'bold',
		color: '#212529',
	},
});

const mapStateToProps = ({ user, cart }) => ({
	lang: user.lang,
	order: cart.order,
	recipientInfo: cart.recipientInfo,
});

const mapDispatchToProps = {
};

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps,
)(OrderSummary);