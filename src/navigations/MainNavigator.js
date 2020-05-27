import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import MainMenu from '../components/MainMenu';
import TabBarComponent from '../components/TabBarComponent';

import HomeScreen from '../views/Home';
import WishlistScreen from '../views/Wishlist';
import ChatListScreen from '../views/ChatList';
import ChatBoxScreen from '../views/ChatBox';
import NotificationListScreen from '../views/NotificationList';
import MerchantScreen from '../views/Merchant';

import CategoryShowScreen from '../views/CategoryShow';
import ProductShowScreen from "../views/ProductShow";
import ProductCommentsScreen from '../views/ProductComments';
import ProductRatingScreen from '../views/ProductRating';
import SelectVariationScreen from '../views/SelectVariation';
import OfficalStoreScreen from '../views/OfficalStore';
import RecommendedStoreScreen from '../views/RecommendedStore';
import SaleProductsScreen from '../views/SaleProducts';
import HotListScreen from '../views/HotList';
import SearchProductsScreen from '../views/SearchProducts';
import StoreShowScreen from '../views/StoreShow';

import CartListScreen from '../views/CartList';
import OrderConfirmationScreen from '../views/OrderConfirmation';
import OrderSummaryScreen from '../views/OrderSummary';

import FollowerListScreen from '../views/FollowerList';
import FollowingListScreen from '../views/FollowingList';
import MyReviewsScreen from '../views/MyReviews';
import MyProfileScreen from '../views/MyProfile';
import MyAddressScreen from '../views/MyAddress';
import CreateAddressScreen from '../views/CreateAddress';
import EditAddressScreen from '../views/EditAddress';
import BuyerInCartScreen from '../views/BuyerInCart';
import BuyerSellerToConfirmCartScreen from '../views/BuyerSellerToConfirm';
import BuyerToReceiveScreen from '../views/BuyerToReceive';
import BuyerCompleteScreen from '../views/BuyerComplete';
import BuyerCancelledScreen from '../views/BuyerCancelled';

import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import RegisterUserScreen from '../views/RegisterUser';

import PasswordResetScreen from '../views/PasswordReset';
import UpdatePasswordScreen from '../views/UpdatePassword';

import HelpScreen from '../views/Help';

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Wish: { screen: WishlistScreen, params: {requiresAuth: true} },
    Chat: { screen: ChatListScreen, params: {requiresAuth: true} },
    ChatBox: { screen: ChatBoxScreen, params: {requiresAuth: true} },
    Notification: { screen: NotificationListScreen, params: {requiresAuth: true} },
    Account: { screen: MerchantScreen },

    CategoryShow: { screen: CategoryShowScreen },
    ProductShow: { screen: ProductShowScreen },
    ProductComments: { screen: ProductCommentsScreen },
    ProductRating: { screen: ProductRatingScreen },
    SelectVariation: { screen: SelectVariationScreen},

    SearchProducts: { screen: SearchProductsScreen },
    OfficalStore: { screen: OfficalStoreScreen },
    RecommendedStore: { screen: RecommendedStoreScreen },
    HotList: { screen: HotListScreen },
    SaleProduct: { screen: SaleProductsScreen },
    StoreShow: { screen: StoreShowScreen },
    CartList: { screen: CartListScreen, params: {requiresAuth: true} },
    OrderConfirmation: { screen: OrderConfirmationScreen, params: {requiresAuth: true} },
    OrderSummary: { screen: OrderSummaryScreen, params: {requiresAuth: true}},
    
    FollowerList: { screen: FollowerListScreen, params: {requiresAuth: true} },
    FollowingList: { screen: FollowingListScreen, params: {requiresAuth: true} },
    MyReviews: { screen: MyReviewsScreen, params: {requiresAuth: true} },
    MyProfile: { screen: MyProfileScreen, params: {requiresAuth: true} },
    MyAddress: { screen: MyAddressScreen, params: {requiresAuth: true} },
    CreateAddress: { screen: CreateAddressScreen, params: {requiresAuth: true} },
    EditAddress: { screen: EditAddressScreen, params: {requiresAuth: true} },
    BuyerInCart: { screen: BuyerInCartScreen, params: {requiresAuth: true} },
    BuyerSellerToConfirm: { screen: BuyerSellerToConfirmCartScreen, params: {requiresAuth: true} },
    BuyerToReceive: { screen: BuyerToReceiveScreen, params: {requiresAuth: true} },
    BuyerComplete: { screen: BuyerCompleteScreen, params: {requiresAuth: true} },
    BuyerCancelled: { screen: BuyerCancelledScreen, params: {requiresAuth: true} },

    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
    RegisterUser: {screen: RegisterUserScreen},

    PasswordReset: {screen: PasswordResetScreen},
    UpdatePassword: {screen: UpdatePasswordScreen},
    
    Help: { screen: HelpScreen },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    backBehavior: 'history',
    defaultNavigationOptions: ({navigation}) => {
      const { routeName } = navigation.state;
      let tabBarVisible = false;
      if (
        routeName === 'Home' ||
        routeName === 'Wish' ||
        routeName === 'Chat' ||
        routeName === 'Notification' ||
        routeName === 'Account' ||
        routeName === 'OfficalStore' ||
        routeName === 'RecommendedStore' ||
        routeName === 'SearchProducts'
      ) {
        tabBarVisible = true;
      }
      return {
        tabBarVisible: tabBarVisible,
      };
    },
    tabBarComponent: props => (
      <TabBarComponent {...props}/>
    ),
  },
)

const DrawerNavigator = createDrawerNavigator(
  {
    Main: TabNavigator
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    contentComponent: MainMenu,
  }
)
export default createAppContainer(DrawerNavigator);
