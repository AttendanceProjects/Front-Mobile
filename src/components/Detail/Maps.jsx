import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image, View, ActivityIndicator, Text } from 'react-native';
import { DetailStyle } from './DetailStyle';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import { getAccess, checkConnection } from '../../service';

const {
  container_maps,
  map_content,
  image_maps,
  map_detail,
  map_style_detail
} = DetailStyle

export const MapCorrections = ({ start, end }) => {
  const [ getCompany, { data: company, loading, error } ] = useLazyQuery( Query.GET_COMPANY );
  const [ offline, setOffline ] = useState( false );

  useEffect(() => {
    (async() => {
      const { network } = await checkConnection();
      if( network ) {
        const { code, token } = await getAccess();
        if( code, token ) {
          await getCompany({ variables: { code, token } });
        }
      }else setOffline( 'Please check you\'re connection' )
    })()
  }, [])
  
  return (
    <View style={ container_maps }>
      { loading && !offline && !error
          ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color='white' />
            </View>
          : offline && !loading && !error
              ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 17, color: 'red' }}>{ offline }</Text>
                </View>
              : !offline && !loading && error
                  ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: 'red' }}>{ error && error.graphQLErrors ? error.graphQLErrors[0].message : 'Something error, please try again!' }</Text>
                    </View>
                  :
                    <MapView style={ map_content }
                      camera={{
                        center: {
                          // latitude: location ? location.latitude : -6.2607917,
                          // longitude: location ? location.longitude : 106.7810557
                          latitude: company && company.getCompany && company.getCompany.location && company.getCompany.location.latitude ? Number( company.getCompany.location.latitude ) : -6.157766, // company location
                          longitude: company && company.getCompany && company.getCompany.location && company.getCompany.location.longitude ? Number( company.getCompany.location.longitude ) : 106.819319 //company location
                        },
                        pitch: 0,
                        heading: 0,
                        altitude: 10000,
                        zoom: 14
                      }}
                    >
                      { start && start.longitude && start.latitude
                          ?
                            <Marker
                              coordinate={{
                                latitude: Number( start.latitude ),
                                longitude: Number( start.longitude )
                              }}
                              title={ 'Check In'}
                              // onPress={() => navigation.navigate('Detail')}
                              // onPress={() => setDestination({
                              //   latitude: Number(start.latitude),
                              //   longitude: Number(start.longitude)
                              // })}
                            >
                              <Image 
                                source={ require('../../../assets/checkin.png') }
                                style={ image_maps }
                              />
                            </Marker> : null }
                      { end && end.longitude && end.latitude
                          ?
                            <Marker
                              coordinate={{
                                latitude: Number( end.latitude ),
                                longitude: Number( end.longitude )
                              }}
                              title={ 'Check Out' }
                            >
                              <Image 
                                source={ require('../../../assets/people.png') }
                                style={ image_maps }
                              />
                            </Marker> : null }
                    </MapView>
      }
      </View>
  )
}

export const MapComponent = ({ param }) => {
  const [ start, setStart ] = useState( {} );
  const [ end, setEnd ] = useState( {} );
  const [ offline, setOffline ] = useState( false );
  const [ getCompany, { data: company, loading, error } ] = useLazyQuery( Query.GET_COMPANY );

  useEffect(() => {
    (async () => {
      const { network } = await checkConnection();
      if( network ) {
        const { code, token } = await getAccess();
        if( code, token ) {
          await getCompany({ variables: { code, token } });
        }
      }else setOffline( 'Please check you\'re connection' )
    })()
    const { start, end } = param;
    setStart( start );
    setEnd( end );
  }, [])

  return (
    <View style={ map_detail }>
      { loading && !offline && !error
          ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color='white' />
            </View>
          : offline && !loading && !error
              ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 17, color: 'red' }}>{ offline }</Text>
                </View>
              : !offline && !loading && error
                  ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: 'red' }}>{ error && error.graphQLErrors ? error.graphQLErrors[0].message : 'Something error, please try again!' }</Text>
                    </View>
                  :
                    <MapView style={ map_style_detail }
                      camera={{
                        center: {
                          // latitude: location ? location.latitude : -6.2607917,
                          // longitude: location ? location.longitude : 106.7810557
                          latitude: company && company.getCompany && company.getCompany.location && company.getCompany.location.latitude ? Number( company.getCompany.location.latitude ) : -6.157766, // company location
                          longitude: company && company.getCompany && company.getCompany.location && company.getCompany.location.longitude ? Number( company.getCompany.location.longitude ) : 106.819319 //company location
                        },
                        pitch: 0,
                        heading: 0,
                        altitude: 10000,
                        zoom: 14
                      }}
                    >
                      { start && start.longitude && start.latitude
                          ?
                            <Marker
                              coordinate={{
                                latitude: Number( start.latitude ),
                                longitude: Number( start.longitude )
                              }}
                              title={ 'Check In'}
                              // onPress={() => navigation.navigate('Detail')}
                              // onPress={() => setDestination({
                              //   latitude: Number(start.latitude),
                              //   longitude: Number(start.longitude)
                              // })}
                            >
                              <Image 
                                source={ require('../../../assets/checkin.png') }
                                style={ image_maps }
                              />
                            </Marker> : null }
                      { end && end.longitude && end.latitude
                          ?
                            <Marker
                              coordinate={{
                                latitude: Number( end.latitude ),
                                longitude: Number( end.longitude )
                              }}
                              title={ 'Check Out' }
                            >
                              <Image 
                                source={ require('../../../assets/people.png') }
                                style={ image_maps }
                              />
                            </Marker> : null }
                    </MapView>
          }
    </View>
  );
}