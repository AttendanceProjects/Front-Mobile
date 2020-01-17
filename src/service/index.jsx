import * as Network from 'expo-network';

export const checkConnection = async ({ save }) => {
  const connection = await Network.getNetworkStateAsync();
  save( connection.isConnected )
}
