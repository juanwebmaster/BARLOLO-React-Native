import { produce } from 'immer';
import { actions } from '../actions/home';

const initialState = {
  bannerImages: [],
  carts: {},
  sellerBadges: [],
  recommendedStores: [],
  headerCategories: [],
  categories: {},
  hotlists: [],
  saleProduct: [],
  saleProductPageNo: 1,
  products: [],
  productPageNo: 1,
  searchresults: {}
}

export default function home(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_BANNER_IMAGES:
          return produce(state, draft => {
              draft.bannerImages = payload.data;
          });
      case actions.SET_CART:
          return produce(state, draft => {
              draft.carts = payload.data;
          });
      case actions.SET_SELLER_BADGES:
        return produce(state, draft => {
            draft.sellerBadges = payload.data;
        });
      case actions.SET_RECOMMENDED_STORES:
        return produce(state, draft => {
            draft.recommendedStores = payload.data;
        });
      case actions.SET_HEADER_CATEGORIES:
        return produce(state, draft => {
            draft.headerCategories = payload.data;
        });
      case actions.SET_CATEGORIES:
        return produce(state, draft => {
            draft.categories = payload.data;
        });
      case actions.SET_HOTLISTS:
        return produce(state, draft => {
            draft.hotlists = payload.data;
        });
      case actions.SET_SALE_PRODUCT:
        return produce(state, draft => {
            draft.saleProduct = payload.data;
            draft.saleProductPageNo = payload.pageNo;
        });
      case actions.SET_SALE_PRODUCT_MORE:
        return produce(state, draft => {
            draft.saleProduct = [...state.saleProduct, ...payload.data];
            draft.saleProductPageNo = payload.pageNo;
        });
      case actions.SET_NEWPRODUCTS:
        return produce(state, draft => {
            draft.products = payload.data;
            draft.productPageNo = payload.pageNo;
        }); 
      case actions.SET_NEWPRODUCTS_MORE:
        return produce(state, draft => {
            draft.products = [...state.products, ...payload.data];
            draft.productPageNo = payload.pageNo;
        }); 
      case actions.SET_SEARCH_RESULTS:
        let results = payload.data
        if (results.success && results.success.category) {
          results.success.category.sort((a, b) => b.count - a.count)
        }
        return produce(state, draft => {
            draft.searchresults = results;
        });
      default:
          return state;
  }
}
