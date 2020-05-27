import { produce } from 'immer';
import { actions } from '../actions/shop';

const initialState = {
    shops: [],
    pageNo: 1,
    totalCount: 0,
    shop: {},
    featureProducts: [],
    products: [],
    pickupLocation: {},
    updatepickupLocation: [],
    sellerUniqueId: ''
}

export default function shop(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case actions.SET_SHOPS:
            return produce(state, draft => {
              if(payload.pageNo == 1) {
                draft.shops =  payload.data;
                draft.pageNo = 1;
              } else if (payload.pageNo != state.pageNo) {
                draft.shops =  [...state.shops, ...payload.data];
                draft.pageNo = payload.pageNo;
              }
              draft.totalCount = payload.totalCount;
            });
        case actions.clearShops:
            return produce(state, draft => {
                draft.shops = [];
                draft.pageNo = 1;
                draft.totalCount = 0;
            });
        case actions.SET_PICKUPLOCATION:
          return produce(state, draft => {
              draft.pickupLocation = payload.data;
          });
        case actions.UPDATE_PICKUPLOCATION:
          return produce(state, draft => {
              draft.pickupLocation = [...state.pickupLocation, ...payload.data];
          });
        case actions.clearShop:
          return produce(state, draft => {
            draft.shop = {};
            draft.featureProducts = [];
            draft.products = [];
          });
        case actions.SET_SHOP:
          return produce(state, draft => {
            draft.shop = payload.data;
          });
        case actions.SET_FEATURE_PRODUCTS:
          return produce(state, draft => {
              draft.featureProducts = payload.data;
          });
        case actions.SET_NEWPRODUCTS:
          return produce(state, draft => {
              draft.products = [...state.products, ...payload.data];
          });
        case actions.SET_SELLER_UNIQUE_ID:
          return produce(state, draft => {
              draft.sellerUniqueId = payload.data;
          });
        case actions.FOLLOW_SHOP:
          return produce(state, draft => {
            draft.shops = state.shops;
            draft.shops.find(storeShop => storeShop.seller_id == payload.data).is_following = 1
          });
        case actions.UNFOLLOW_SHOP:
          return produce(state, draft => {
              draft.shops = state.shops;
              draft.shops.find(storeShop => storeShop.seller_id == payload.data).is_following = 0
          });
        default:
            return state;
    }
}
