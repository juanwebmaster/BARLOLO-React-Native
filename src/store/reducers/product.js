import { produce } from 'immer';
import { actions } from '../actions/product';

const initialState = {
  product: [],
  carts: {},
  skuProduct: {},
  skuOfProduct: {},
  sellerProducts: [],
  merchantProducts: [],
  merchantProductsSimiler: [],
  similarProducts: [],
  wishlistProductIdList: [],
  wishlistProducts: [],
  productCommentList: [],
  productRatingList: [],
  productError: '',
  showCommentModal: false,
  addProductImgs: [],
  addSingleProductImgs: '',
  catVariations: {},
  simpleProduct: [],
  editProduct: {},
  sellerUniqueId: ''
}

export default function product(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_PRODUCT:
          return produce(state, draft => {
              draft.product = payload.data;
          });
      case actions.SET_CART:
          return produce(state, draft => {
            draft.carts = payload.data;
            draft.cartItems = payload.items;
          });
      case actions.SET_SKU_PRODUCT:
        return produce(state, draft => {
            draft.skuProduct = payload.data;
        });
      case actions.SET_SKU_OF_PRODUCT:
        return produce(state, draft => {
            draft.skuOfProduct = payload.data;
        });
      case actions.EDIT_S:
        return produce(state, draft => {
            draft.sellerProducts = payload.data;
        });
      case actions.SET_MERCHANT_PRODUCTS:
        return produce(state, draft => {
            draft.merchantProducts = payload.data;
        });
      case actions.SET_MERCHANT_PRODUCTS_SIMILER:
        return produce(state, draft => {
            draft.merchantProductsSimiler = payload.data;
        });
      case actions.SET_WISHLISTS_PRODUCT_ID:
        return produce(state, draft => {
            draft.wishlistProductIdList = payload.data;
        });
      case actions.SET_WISHLIST_PRODUCTS:
        return produce(state, draft => {
            draft.wishlistProducts = payload.data;
        });
      case actions.SET_PRODUCT_ERROR:
        return produce(state, draft => {
            draft.productError = payload.data;
        });
      case actions.RESET_PRODUCT_ERROR:
        return produce(state, draft => {
            draft.productError = '';
        });
      case actions.SET_PRODUCT_COMMENT:
        return produce(state, draft => {
            draft.productCommentList = payload.data;
        });
      case actions.SET_PRODUCT_RATING:
        return produce(state, draft => {
            draft.productRatingList = payload.data;
        });
      case actions.SHOW_PRODUCT_COMMENT:
        return produce(state, draft => {
            draft.showCommentModal = payload.data;
        });
      case actions.ADD_PRODUCT_IMGS:
        return produce(state, draft => {
            draft.addProductImgs.push(payload.data);
        });
      case actions.ADD_PRODUCT_IMG:
        return produce(state, draft => {
            draft.addSingleProductImgs = payload.data;
        });
      case actions.SET_CAT_VARIATION:
        return produce(state, draft => {
            draft.catVariations = payload.data;
        });
      case actions.ADD_PRODUCT:
        return produce(state, draft => {
            draft.simpleProduct = payload.data;
        });
      case actions.SET_EDIT_SELLER_PRODUCT:
        return produce(state, draft => {
            draft.editProduct = payload.data;
        });
      case actions.SET_SELLER_UNIQUE_ID:
        return produce(state, draft => {
            draft.sellerUniqueId = payload.data;
        });
      default:
          return state;
  }
}