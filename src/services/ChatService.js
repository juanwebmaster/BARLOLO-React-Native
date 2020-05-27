import apiClient from './adminApiClient';
// import chatApi from './chatApi';

import config from '../config/config';

let baseURL = config.get('APP_CHAT_API_ENDPOINT');

import RNFetchBlob from 'rn-fetch-blob';

export default {
  getChats(customerId) {
    return apiClient.get(`/rest/V1/mobilesellerchat/getsellerchatdata?customerid=${customerId}`)
  },
  getChatList(senderUniqueId) {
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-list?senderUniqueId=${senderUniqueId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-list`, {
    //   params:{
    //     senderUniqueId: senderUniqueId
    //   }
    // })
  },
  getCustomerUniqueId(customerId){
    return apiClient.get(`/rest/V1/mobilesellerchat/getcustomuniqueid?customerid=${customerId}`)
  },
  getChatRoom(senderUniqueId,receiverUniqueId){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-room?senderUniqueId=${senderUniqueId}&receiverUniqueId=${receiverUniqueId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-room`, {
    //   params:{
    //     senderUniqueId: senderUniqueId,
    //     receiverUniqueId: receiverUniqueId
    //   }
    // })
  },
  getChatMessages(roomId,page){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-messages?roomId=${roomId}&page=${page}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-messages`, {
    //   params:{
    //     roomId: roomId,
    //     page:page
    //   }
    // })
  },
  getCustomerInfo(uniqueId){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-customer-info?uniqueId=${uniqueId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-customer-info`, {
    //   params:{
    //     uniqueId: uniqueId
    //   }
    // })
  },
  markChatMsgAsRead(roomId , receiverUniqueId){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/mark-chat-msg-read?roomId=${roomId}&receiverUniqueId=${receiverUniqueId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/mark-chat-msg-read`, {
    //   params:{
    //     roomId: roomId,
    //     receiverUniqueId: receiverUniqueId
    //   }
    // })
  },
  getUnreadMessageCount(uniqueId){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-unread-msg-count?uniqueId=${uniqueId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-unread-msg-count`, {
    //   params:{
    //     uniqueId: uniqueId
    //   }
    // })
  },
  getUniqueIdFromCustomerId(customerId){
    return RNFetchBlob.config({
      trusty : true
    })
    .fetch('GET', `${baseURL}/v1/chat/get-unique-id?customerId=${customerId}`)
    .then(res => {
      return({data: res.json()});
    })
    .catch(e => {
      Promise.reject(e);
    })
    // return chatApi.get(`/v1/chat/get-unique-id`, {
    //   params:{
    //     customerId: customerId
    //   }
    // })
  }
 }