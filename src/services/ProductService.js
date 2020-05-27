import apiClient from './userApiClient'
import adminApiClient from './adminApiClient'
// import chatApi from './chatApi';

import config from '../config/config';

let baseURL = config.get('APP_CHAT_API_ENDPOINT');

import RNFetchBlob from 'rn-fetch-blob';

export default {
    getProduct(storeId, productId, loginId) {
        return adminApiClient.get(
            `/rest/V1/custom/productdetail?storeid=${storeId}&productid=${productId}&loginid=${loginId}`
        )
    },

    getSkuOfProduct(sku) {
        return adminApiClient.get(`/rest/V1/custom/productdetailbysku?sku=${sku}`)
    },

    removeProduct(productId) {
        return adminApiClient.delete(
            `/rest/V1/custom/deleteProduct?product_id=${productId}`
        )
    },

    getProductWithSku(sku, storeId) {
        return adminApiClient.get(`/rest/V1/products/${sku}?storeid=${storeId}`)
    },

    getSellerProducts(sellerId) {
        return adminApiClient.get(
            `/rest/V1/mpapi/admin/sellers/${sellerId}/product`
        )
    },

    getWishlists(customerId) {
        return apiClient.get(`/rest/V1/wishlist/products/${customerId}`)
    },

    getMerchantProducts(storeId, customerId, productIdList) {
        return adminApiClient.post(
            `/rest/V1/custom/catproduct?storeid=${storeId}&customerid=${customerId}&productid=${productIdList
        .map(x => x.product_id)
        .join(',')}`
        )
    },

    getMerchantProductsSimiler(customerId, productIdList) {
        return adminApiClient.get(
            `/rest/V1/custom/relatedproducts?storeid=1&customerid=${customerId}&productid=${productIdList}`
        )
    },

    getStoreSellerProducts(storeId, customerId, productIdList) {
        return adminApiClient.post(
            `/rest/V1/custom/catproduct?storeid=${storeId}&customerid=${customerId}&productid=${productIdList}`
        )
    },
    addToWishlist(productId, customerId) {
        return apiClient.post(`/rest/V1/wishlist/products/${productId}/1`, {
            customer_id: customerId
        })
    },

    removeFromWishlist(customerId, wishItemId) {
        return apiClient.put(`/rest/V1/wishlist/delete`, {
            customer_id: customerId,
            wishlist_item_id: wishItemId
        })
    },

    getQuestions(productId) {
        return apiClient.get(`/rest/V1/product/getquestions/${productId}`)
    },

    createQuestion(data) {
        return apiClient.post(`/rest/V1/product/postquestion`, data)
    },

    createAnswer(data) {
        return apiClient.post(`/rest/V1/product/postanswer`, data)
    },

    getRatings(productId) {
        return adminApiClient.get(
            `/rest/V1/custom/productreviews?productid=${productId}`
        )
    },

    addProductImage(image, customerId, ext) {
        return adminApiClient.post(`/rest/V1/custom/uploadProductImage`, {
            customerId: customerId,
            image: image,
            ext: ext
        })
    },

    addProduct(data) {
        return adminApiClient.post(`/rest/V1/custom/addProductnewapi`, {
            product: data
        })
    },

    getCategoryVariation(storeId, catId) {
        return adminApiClient.get(
            `/rest/V1/custom/catfilter?storeid=${storeId}&category=${catId}`
        )
    },

    getEditSellerProduct(productId) {
        return adminApiClient.get(
                `/rest/V1/custom/sellerproductview?product_id=${productId}`
            )
            // return adminApiClient.get(
            //     `/rest/V1/custom/sellerproductview?product_id=82389`
            // )
    },
    getSellerUniqueIdFromProductId(productId) {
        return RNFetchBlob.config({
            trusty : true
            })
            .fetch('GET', `${baseURL}/v1/chat/get-seller-unique-id?productId=${productId}`)
            .then(res => {
                return({data: res.json()});
            })
            .catch(e => {
                Promise.reject(e);
            })
        // return chatApi.get(`v1/chat/get-seller-unique-id`, {
        //     params: {
        //         productId: productId
        //     }
        // })
    }
}