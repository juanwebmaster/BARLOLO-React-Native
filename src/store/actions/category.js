import CategoryService from '@app/services/CategoryService.js'

export const actions = {
    SET_BANNER_IMAGES: 'Category/SET_BANNER_IMAGES',
    SET_SELLER_BADGES: 'Category/SET_SELLER_BADGES',
    SET_RECOMMENDED_STORES: 'Category/SET_RECOMMENDED_STORES',
    SET_POPULAR_SUBCATEGORIES: 'Category/SET_POPULAR_SUBCATEGORIES',
    SET_CAT_FILTERS: 'Category/SET_CAT_FILTERS',
    SET_CAT_SORTS: 'Category/SET_CAT_SORTS',
    SET_CAT_ITEMS: 'Category/SET_CAT_ITEMS',
    SET_CAT_ITEMS_HOT: 'Category/SET_CAT_ITEMS_HOT',
    CLEAR_CAT_ITEMS: 'Category/CLEAR_CAT_ITEMS',
    SET_CAT_PRODUCTS: 'Category/SET_CAT_PRODUCTS',
    SET_CAT_DETAIL: 'Category/SET_CAT_DETAIL',
    SET_PRODUCT_TOTAL: 'Category/SET_PRODUCT_TOTAL',
};
  
export const fetchBannerImages = ({ storeId, catId }) => dispatch => {
    return CategoryService.getBannerImages(storeId, catId)
        .then(response => {
            dispatch({
                type: actions.SET_BANNER_IMAGES,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchSellerBadges = ({ storeId, catId }) => dispatch => {
    return CategoryService.getSellerBadges(storeId, catId)
        .then(response => {
            dispatch({
                type: actions.SET_SELLER_BADGES,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchRecommendedStores = ({ storeId, catId }) => dispatch => {
    return CategoryService.getRecommendedStores(storeId, catId)
        .then(response => {
            dispatch({
                type: actions.SET_RECOMMENDED_STORES,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchPopularSubcategories = (lang, catId) => dispatch => {
    return CategoryService.getPopularSubcategories(lang, catId)
        .then(response => {
            dispatch({
                type: actions.SET_POPULAR_SUBCATEGORIES,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatFilters = ({ storeId, catId }) => dispatch => {
    return CategoryService.getCatFilters(storeId, catId)
        .then(response => {
            dispatch({
                type: actions.SET_CAT_FILTERS,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatDetail = (catId) => dispatch => {
    return CategoryService.getCategoryDetail(catId)
        .then(response => {
            dispatch({
                type: actions.SET_CAT_DETAIL,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatSorts = ({ storeId, catId }) => dispatch => {
    return CategoryService.getCatSorts(storeId, catId)
        .then(response => {
            dispatch({
                type: actions.SET_CAT_SORTS,
                payload: {
                  data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatItems = ({ catId, pageSize, pageNo, price, catFilters, catSort, searchKeyword }) => dispatch => {
    return CategoryService.getCatItems(
            catId,
            pageSize,
            pageNo,
            price,
            catFilters,
            catSort,
            searchKeyword
        )
        .then(response => {
            dispatch({
                type: actions.SET_PRODUCT_TOTAL,
                payload: {
                  data: response.data.total,
                },
            })
            dispatch({
                type: actions.SET_CAT_ITEMS,
                payload: {
                  data: response.data.item,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatItemsHot = ({ catId, pageSize, pageNo, price, catFilters, catSort, searchKeyword }) => dispatch => {
    return CategoryService.getCatItems(
            catId,
            pageSize,
            pageNo,
            price,
            catFilters,
            catSort,
            searchKeyword
        )
        .then(response => {
            dispatch({
                type: actions.SET_PRODUCT_TOTAL,
                payload: {
                  data: response.data.total,
                },
            })
            dispatch({
                type: actions.SET_CAT_ITEMS_HOT,
                payload: {
                  data: response.data.item,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const fetchCatProducts = ({ storeId, customerId, productIdList, pageNo }) => dispatch => {
    return CategoryService.getCatProducts(storeId, customerId, productIdList)
        .then(response => {
            dispatch({
                type: actions.SET_CAT_PRODUCTS,
                payload: {
                  data: response.data,
                  pageNo,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
};

export const clearCatItems = () => ({
    type: actions.CLEAR_CAT_ITEMS,
    payload: {
    },
});
