import { produce } from 'immer';
import { actions } from '../actions/merchant';

const initialState = {
    followers: [],
    followersCount: 0,
    followings: [],
    followingsCount: 0,
    purchaseHistory: {},
    saleHistory: {},
    recentProducts: [],
    merchantInfo: {},
    buyerReview: {},
    buyerProductReviews: [],
    sellerReview: {},
    sellerProductReviews: [],
    sellerPaymentInfo: [],
    bankInfos: [],
    sellerProducts: {}
}

export default function auth(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case actions.SET_FOLLOWERS:
            return produce(state, draft => {
                draft.followers = payload.data.item;
                draft.followersCount = payload.data.count;
            });
        case actions.SET_FOLLOWINGS:
            return produce(state, draft => {
                draft.followings = payload.data.item;
                draft.followingsCount = payload.data.count;
            });
        case actions.REMOVE_FOLLOWING:
            return produce(state, draft => {
                draft.followings = state.followings.filter(
                    following => following.entity_id != payload.data
                )
                draft.followingsCount = draft.followings.length;
            });
        case actions.SET_PURCHASE_HISTORY:
            return produce(state, draft => {
                draft.purchaseHistory = payload.data;
            });
        case actions.SET_SALE_HISTORY:
            return produce(state, draft => {
                draft.saleHistory = payload.data;
            });
        case actions.SET_RECENT_PRODUCTS:
            return produce(state, draft => {
                draft.recentProducts = payload.data;
            });
        case actions.SET_MERCHANT_INFO:
            return produce(state, draft => {
                draft.merchantInfo = payload.data;
            });
        case actions.SET_BUYER_REVIEW:
            return produce(state, draft => {
                draft.buyerReview = payload.data;
                draft.buyerProductReviews = payload.data.all;
            });
        case actions.SET_SELLER_REVIEW:
            return produce(state, draft => {
                draft.sellerReview = payload.data;
                draft.sellerProductReviews = payload.data.all;
            });
        case actions.SET_SELLER_PAYMENT_INFO:
            return produce(state, draft => {
                draft.sellerPaymentInfo = payload.data;
            });
        case actions.SET_BANK_INFOS:
            return produce(state, draft => {
                draft.bankInfos = payload.data;
            });
        case actions.SET_SELLER_PRODUCTS:
            return produce(state, draft => {
                draft.sellerProducts = payload.data;
            });
        default:
            return state;
    }
}
