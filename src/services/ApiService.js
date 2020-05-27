import apiClient from './adminApiClient'

export default {
    getHomeBanner() {
        // return apiClient.get('/homepagebanner')
        return apiClient.get('/rest/V1/custom/homepagebanner')
    },

    getSellerBadges(myStoreId) {
        // return apiClient.get('/seller_badges')
        return apiClient.get(
            '/rest/V1/custom/sellerbadge?storeid=' + myStoreId + '&category=0'
        )
    },

    getHeaderCategories(storeid) {
        return apiClient.get(
            `/rest/V1/demac/webservice/getAllCategory?storeId=${storeid}`
        )
    },

    getCategories(lang) {
        let myStoreId = lang == 'mm' ? '/mmu' : ''
        return apiClient.get(
            '/rest' +
            myStoreId +
            '/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=2'
        )
    },

    getHotLists(storeId) {
        return apiClient.get(`/rest/V1/custom/hotlist?storeid=${storeId}`)
    },
    getSaleProductLists(storeId, customerId, pageSize=30, pageNo) {
        return apiClient.get(`/rest/V1/custom/saleproducts?storeid=${storeId}&customerid=${customerId}&pagesize=${pageSize}&pageno=${pageNo}`)
    },

    getHotListProducts() {
        return apiClient.get('/rest/V1/custom/catproduct')
    },

    getRecentProducts(storeId, customerId, pageSize=30, pageNo, cancelSource) {
        return apiClient.get(
            `/rest/V1/custom/recentproduct?storeid=${storeId}&customerid=${customerId}&pagesize=${pageSize}&pageno=${pageNo}`, {
                cancelToken: cancelSource.token
            }
        )
    },

    getRecommendedStores(lang) {
        // return apiClient.get('/recommended_products')
        let myStoreId = lang == 'mm' ? 2 : 1
        return apiClient.get(
            '/rest/V1/custom/recommendedproduct?storeid=' + myStoreId + '&category=0'
        )
    },

    // Location
    async getLocation(countryCode, regionId, cityId) {
        return apiClient.get(
            `/rest/V1/barlolocat/country?countryCode=${countryCode}&regionId=${regionId}&cityId=${cityId}`
        )
    },

    // Notification
    getNotification(customerId) {
        return apiClient.get(`/rest/V1/notifylist?customer_id=${customerId}`)
    },
    // Searh on homepage
    getSearchResults(keyWord, onlyproduct, categoryId, cancelSource) {
        return apiClient.get(
            `/rest/V1/custom/searchapimob?keyWord=${keyWord}&onlyproduct=${onlyproduct}&categoryId=${categoryId}`, {
                cancelToken: cancelSource.token
            }
        )
    },
    // Notification
    getNotification(customerId) {
        return apiClient.get(`/rest/V1/notifylist?customer_id=${customerId}`)
    }
}