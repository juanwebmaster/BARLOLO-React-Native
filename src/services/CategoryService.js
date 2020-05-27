import apiClient from './adminApiClient'

export default {
    getBannerImages(storeId, catId) {
        return apiClient.get(
            `/rest/V1/custom/catbanner?storeid=${storeId}&category=${catId}`
        )
    },

    getSellerBadges(storeId, catId) {
        return apiClient.get(
            `/rest/V1/custom/sellerbadge?storeid=${storeId}&category=${catId}`
        )
    },

    getRecommendedStores(storeId, catId) {
        return apiClient.get(
            `/rest/V1/custom/recommendedproduct?storeid=${storeId}&category=${catId}`
        )
    },

    getCategoryDetail(catId) {
        return apiClient.get(`/rest/V1/categories/${catId}`)
    },

    getPopularSubcategories(lang, catId) {
        let myStoreId = lang == 'mm' ? '/mmu' : ''
        return apiClient.get(
            '/rest' +
            myStoreId +
            '/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=' +
            catId
        )
    },

    getCatFilters(storeId, catId) {
        return apiClient.get(
            `/rest/V1/custom/catfilter?storeid=${storeId}&category=${catId}`
        )
    },

    getCatSorts(storeId, catId) {
        return apiClient.get(
            `/rest/V1/custom/catsort?storeid=${storeId}&category=${catId}`
        )
    },

    getCatItems(catId, pageSize, pageNo, price, catFilters, catSort, searchKeyword) {
        // console.log(catId, pageSize, pageNo, price, catFilters, catSort, searchKeyword)
        let filter = `/rest/V1/barlolocat/catitem?
      searchCriteria[filterGroups][0][filters][0][field]=category_id&
      searchCriteria[filterGroups][0][filters][0][value]=${catId}&
      searchCriteria[filterGroups][0][filters][0][conditionType]=eq&
      searchCriteria[filterGroups][1][filters][0][field]=status&
      searchCriteria[filterGroups][1][filters][0][value]=1&
      searchCriteria[filterGroups][1][filters][0][conditionType]=eq`

        if (price[0] || price[1]) {
            filter += `
      &searchCriteria[filterGroups][2][filters][0][field]=price&
      searchCriteria[filterGroups][2][filters][0][value]=${price[0]}&
      searchCriteria[filterGroups][2][filters][0][conditionType]=gteq&
      searchCriteria[filterGroups][2][filters][1][field]=price&
      searchCriteria[filterGroups][2][filters][1][value]=${price[1]}&
      searchCriteria[filterGroups][2][filters][1][conditionType]=lteq`
        }
     if (searchKeyword != '' && typeof searchKeyword != 'undefined') {
            filter += `
          &searchCriteria[filterGroups][0][filters][2][conditionType]=like&
          searchCriteria[filterGroups][0][filters][2][value]=${searchKeyword}&
          searchCriteria[filterGroups][0][filters][2][field]=name`
        }

        if (catFilters.length) {
            let index = price[0] || price[1] ? 3 : 2

            catFilters.forEach(catFilter => {
                filter += `
        &searchCriteria[filterGroups][${index}][filters][0][field]=${catFilter.name}&
        searchCriteria[filterGroups][${index}][filters][0][value]=${catFilter.value}&
        searchCriteria[filterGroups][${index}][filters][0][conditionType]=eq`

                index++
            })
        }

        filter += `&searchCriteria[sortOrders][0][field]=${catSort.name}&
      searchCriteria[sortOrders][0][direction]=${catSort.direction}&
      searchCriteria[pageSize]=${pageSize}&
      searchCriteria[currentPage]=${pageNo}`

        return apiClient.get(filter)
    },

    getCatProducts(storeId, customerId, productIdList) {
        let customerIds = typeof customerId === 'undefined' ? 0 : customerId

        return apiClient.post(
            `/rest/V1/custom/catproduct?storeid=${storeId}&customerid=${customerIds}&productid=${productIdList}`
        )
    }
}