import ShopService from '@app/services/ShopService.js'
import CategoryService from '@app/services/CategoryService.js'
import ChatService from '@app/services/ChatService.js'

export const actions = {
    SET_SHOPS: 'Shop/SET_SHOPS',
    FOLLOW_SHOP: 'Shop/FOLLOW_SHOP',
    UNFOLLOW_SHOP: 'Shop/UNFOLLOW_SHOP',
    clearShops: 'Shop/clearShops',
    clearShop: 'Shop/clearShop',
    SET_PICKUPLOCATION: 'Shop/SET_PICKUPLOCATION',
    UPDATE_PICKUPLOCATION: 'Shop/UPDATE_PICKUPLOCATION',
    SET_SHOP: 'Shop/SET_SHOP',
    SET_FEATURE_PRODUCTS: 'Shop/SET_FEATURE_PRODUCTS',
    SET_NEWPRODUCTS: 'Shop/SET_NEWPRODUCTS',
    SET_SELLER_UNIQUE_ID: 'Shop/SET_SELLER_UNIQUE_ID',
};

export const clearShops = () => ({
    type: actions.clearShops,
    payload: {
    },
})

export const clearShop = () => ({
    type: actions.clearShop,
    payload: {
    },
})

export const followShop = (shop) => ({
    type: actions.FOLLOW_SHOP,
    payload: {
        data: shop.seller_id
    },
})

export const unfollowShop = (shop) => ({
    type: actions.UNFOLLOW_SHOP,
    payload: {
        data: shop.seller_id
    },
})

export const fetchShops = (data) => dispatch => {
    return ShopService.getShops(data)
        .then(response => {
            if(response.data && response.data.item && response.data.item.length > 0) {
                dispatch({
                    type: actions.SET_SHOPS,
                    payload: {
                        data: response.data.item,
                        totalCount: response.data.count,
                        pageNo: data.pageNo,
                    },
                })
            }
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const fetchPickupLocation = (data) => dispatch => {
    return ShopService.getPickupLocation(data)
        .then(response => {
            dispatch({
                type: actions.SET_PICKUPLOCATION,
                payload: {
                    data: response.data.storeaddress || {},
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const updatePickupLocation = (data) => dispatch => {
    return ShopService.updatePickupLocation(data)
        .then(response => {
            console.log(response.data.storeaddress);
            // commit('SET_PICKUPLOCATION', response.data.storeaddress)
            // dispatch({
            //     type: 'SET_PICKUPLOCATION',
            //     payload: {
            //         data: response.data.storeaddress,
            //     },
            // })
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const deletePickupLocation = (data) => dispatch => {
    console.log(data);
    return ShopService.deletePickupLocation(data)
        .then(response => {
            dispatch({
                type: actions.SET_PICKUPLOCATION,
                payload: {
                    data: {},
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const fetchShop = ({ sellerId, limit, pageNo, field, direction, filterValue, customreId }) => dispatch => {
    return new Promise((resolve, reject) => {
        ShopService.getShop(
            sellerId,
            limit,
            pageNo,
            field,
            direction,
            filterValue,
            customreId
        )
        .then(response => {
            dispatch({
                type: actions.SET_SHOP,
                payload: {
                    data: response.data,
                },
            })
            resolve(response);
        })
        .catch(error => {
            console.log(error)
            reject(error);
        })
    })
}

export const fetchFeatureProducts = ({ storeId, productIdList }) => dispatch => {
    return CategoryService.getCatProducts(storeId, productIdList)
        .then(response => {
            dispatch({
                type: actions.SET_FEATURE_PRODUCTS,
                payload: {
                    data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const fetchProducts = ({ storeId, customerId, productIdList }) => dispatch => {
    return CategoryService.getCatProducts(storeId, customerId, productIdList)
        .then(response => {
            dispatch({
                type: actions.SET_NEWPRODUCTS,
                payload: {
                    data: response.data,
                },
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

export const updateShopProfile = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        ShopService.updateShopProfile(data)
            .then(response => {
                // console.log(response);
                // commit('ADD_BANNER_IMGS', response.data.profile_image.path)
                resolve(response);
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
            })
    })
}

export const addBannerImage = ({ image, customerId, ext }) => dispatch => {
    return new Promise((resolve, reject) => {
        ShopService.addBannerImage(image, customerId, ext)
            .then(response => {
                dispatch({
                    type: actions.ADD_BANNER_IMGS,
                    payload: {
                        data: response.data.profile_image.path,
                    },
                })
                resolve(response);
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
            })
    })
}

export const addLogoImage = ({ image, customerId, ext }) => dispatch => {
    return new Promise((resolve, reject) => {
        ShopService.addLogoImage(image, customerId, ext)
            .then(response => {
                dispatch({
                    type: actions.ADD_LOGO_IMGS,
                    payload: {
                        data: response.data.store_logo.path,
                    },
                })
                resolve(response);
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
            })
    })
}

export const fetchSellerUniqueId = (customerId) => dispatch => {
    return ChatService.getUniqueIdFromCustomerId(customerId)
        .then(response => {
            dispatch({
                type: actions.SET_SELLER_UNIQUE_ID,
                payload: {
                    data: response.data.uniqueId,
                },
            })
        })
        .catch(error => {
            dispatch({
                type: actions.SET_SELLER_UNIQUE_ID,
                payload: {
                    data: '',
                },
            })
        })
}
