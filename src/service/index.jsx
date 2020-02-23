import * as Network from 'expo-network';
import { AsyncStorage } from 'react-native';
import { server, serverTime } from './service';

export const checkConnection = async _ => {
  return new Promise(resolve => {
    Network.getNetworkStateAsync()
      .then(({ isConnected }) => resolve({ network: isConnected }))
  })
}

export const getAccess = async () => {
  const data = JSON.parse( await AsyncStorage.getItem('access'))
  if( data ) return data
  else return false
}

export const uploadImage = async ({ code, token, formData }) => {
  try{
    const { data } = await server(code)({
                              method: 'post', 
                              url: '/upload',
                              data: formData, 
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data',
                                token
                              } })
    return { success: data.url }
  }catch(err) { if( err.response.data ) { return { error: err.response.data.msg } } else { return { error: err.response } } }
}

export const getServerTime = async ({ code, token }) => {
  try {
    const { data } = await serverTime( code )({
                              method: 'get',
                              url: '/time',
                              headers: { token }                            
                            })
    return { time: data.time }
  }catch(err) {
    if( err.response.data ) return { error: err.response.data.msg };
    else return { error: err.message }
  }
} 