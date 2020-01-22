import * as Network from 'expo-network';
import { AsyncStorage } from 'react-native';
import { server } from './service';

export const checkConnection = async ({ save }) => {
  const connection = await Network.getNetworkStateAsync();
  save( connection.isConnected )
}

export const getAccess = async () => JSON.parse( await AsyncStorage.getItem('access')) 

export const uploadImage = async ({ code, token, formData }) => {
  try{
    const { data } = await server(code)({
                              method: 'post', 
                              url: '/attendance/upload',
                              data: formData, 
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data',
                                token
                              } })
    return { success: data.url }
  }catch(err) { if( err.response.data ) { return { error: err.response.data.msg } } else { return { error: err.response } } }
}