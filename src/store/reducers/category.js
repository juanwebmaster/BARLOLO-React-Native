import { produce } from 'immer';
import { actions } from '../actions/category';

const initialState = {
    bannerImages: [],
    sellerBadges: [],
    recommendedStores: [],
    popularSubcategories: [],
    catFilters: {},
    catSorts: [],
    catItems: [],
    catItemsHot: [],
    catProducts: [],
    categoryDetail: {},
    productTotal: 0,
    pageNo: 1,
}

export default function category(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_BANNER_IMAGES:
          return produce(state, draft => {
              draft.bannerImages = payload.data;
          });
      case actions.SET_SELLER_BADGES:
          return produce(state, draft => {
              draft.sellerBadges = payload.data;
          });
      case actions.SET_RECOMMENDED_STORES:
        return produce(state, draft => {
            draft.recommendedStores = payload.data;
        });
      case actions.SET_POPULAR_SUBCATEGORIES:
        return produce(state, draft => {
            draft.popularSubcategories = payload.data;
        });
      case actions.SET_CAT_FILTERS:
        return produce(state, draft => {
            draft.catFilters = payload.data;
        });
      case actions.SET_CAT_SORTS:
        return produce(state, draft => {
            draft.catSorts = payload.data;
        });
      case actions.SET_CAT_ITEMS:
        return produce(state, draft => {
            draft.catItems = payload.data;
        });
      case actions.SET_CAT_ITEMS_HOT:
        return produce(state, draft => {
            draft.catItemsHot = payload.data;
        });
      case actions.CLEAR_CAT_ITEMS:
        return produce(state, draft => {
          draft.catItems = [];
          draft.catItemsHot = [];
          draft.catProducts = [];
          draft.productTotal = 0;
          draft.pageNo = 1;
        });
      case actions.SET_CAT_PRODUCTS:
        return produce(state, draft => {
            payload.pageNo == 1 ? draft.catProducts = payload.data:
              draft.catProducts = [...state.catProducts, ...payload.data];
            draft.pageNo = payload.pageNo;
        });
      case actions.SET_CAT_DETAIL:
        return produce(state, draft => {
            draft.catItems = [];
            draft.categoryDetail = payload.data;
        });
      case actions.SET_PRODUCT_TOTAL:
        return produce(state, draft => {
            draft.productTotal = payload.data;
        });
      default:
          return state;
  }
}
