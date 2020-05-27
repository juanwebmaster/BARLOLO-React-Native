import AsyncStorage from '@react-native-community/async-storage';

const setItem = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data);
    return data;
  } catch (error) {
    console.log('Save Fail: ', error);
  }
};

const getItem = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {return value;}
  } catch (error) {
    console.log('Get Fail: ', error);
  }
};

const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Remove Fail: ', error);
  }
};

export default {
  setItem,
  getItem,
  removeItem,
}