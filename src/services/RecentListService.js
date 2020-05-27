import apiClient from './adminApiClient'

export default {
  getCatItems(pageSize, pageNo) {
    let filter = `/rest/V1/barlolocat/catitem?
        searchCriteria[filterGroups][0][filters][1][field]=status&
        searchCriteria[filterGroups][0][filters][1][value]=1&
        searchCriteria[filterGroups][0][filters][1][conditionType]=eq&
        searchCriteria[sortOrders][0][field]=created_at&
        searchCriteria[sortOrders][0][direction]=ASC&
        searchCriteria[pageSize]=${pageSize}&
        searchCriteria[currentPage]=${pageNo}`

    return apiClient.get(filter)
  }
}
