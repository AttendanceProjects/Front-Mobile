import React, { useState, useEffect } from 'react';
import { View, Animated, Text, TouchableOpacity, ActivityIndicator, Platform, Image } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import { MapCorrections } from '../../components';

export const FadeViewAdmin = ({ close, id, code, token }) => {
  const [ fetch, { data: el, loading } ] = useLazyQuery( Query.GET_CORRECTION_ID );
  // const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ isFetch, setIsFetch ] = useState( true );

  const [ acceptLoading, setAcceptLoading ] = useState( false );
  const [ rejectLoading, setRejectLoading ] = useState( false );
  

  const _onClear = meth => setTimeout(() => meth( false ), 2000);

  const FadeInView = props => {
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
  
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1.35,
        duration: 800,
      }).start();
    }, []);
  
    return (
      <Animated.View // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim, // Bind opacity to animated value
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [500, 1]  // 0 : 150, 0.5 : 75, 1 : 0
            }),
          }],
        }}>
        {props.children}
      </Animated.View>
    );
  };

  const _onClosed = async _ => {
    await setIsFetch( false );
    close( false );
  }

  useEffect(() => {
    (async () => {
      // setLoading( true );
      if( isFetch ) {
        try { await fetch({ variables: { code, token, id } }); }
        catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage );}
      }
    })()
  }, [])


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FadeInView style={{ width: '100%', height: 500, backgroundColor: '#f1fcfc', borderRadius: 20, padding: 10 }}>
        { loading && !message
            ? (<View style={{ height: '70%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='black' />
                <Text style={{ marginTop: 10, fontSize: Platform.OS === 'android' ? 13 : 18, fontWeight: 'bold' }}>
                  Loading...
                </Text>
              </View>)
            : null }
        { message && !loading
            ? (<View style={{ height: '70%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{ message }</Text>
              </View>) : null }
        { el && el.getOneCorrection && !loading && !message
            ? 
            <>
              <View style={{ height: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', margin: 10 }}>
                  Response Request
                </Text>
                <TouchableOpacity onPress={() => _onClosed()}>
                  <Text style={{ fontSize: Platform.OS === 'android' ? 30: 35 }}>
                    &times;
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: '70%', width: '100%', padding: 5, flexDirection: 'row' }}>
                
                <View style={{ width: '50%', height: '100%', padding: 5 }}>
                  <View style={{ height: '10%', width: '100%', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'grey' }}>Request Created</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                      { el.getOneCorrection.createdAt
                          ? `${ new Date( el.getOneCorrection.createdAt ).toDateString('en-US',{ timeZone: 'Asia/Jakarta' }) } ${ new Date( el.getOneCorrection.createdAt ).toLocaleTimeString('en-US',{ timeZone: 'Asia/Jakarta' })}`
                          : 'Invalid Date' }
                    </Text>
                  </View>
                  <View style={{ width: '100%', height: '20%', padding: 5 }}>
                    <Text style={{ color: 'grey' }}>Before</Text>
                    <View style={{ paddingLeft: 5, paddingTop: 5 }}>
                      <View style={{ width: '100%', padding: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: 'grey', width: '50%' }}>Check In</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          { el.getOneCorrection.AttId && el.getOneCorrection.AttId.start
                              ? el.getOneCorrection.AttId.start
                              : ' - '}
                        </Text>
                      </View>
                      <View style={{ width: '100%', padding: 1, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, color: 'grey', width: '50%' }}>Check Out</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          { el.getOneCorrection.AttId && el.getOneCorrection.AttId.end
                              ? el.getOneCorrection.AttId.end
                              : ' - '}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: '20%', padding: 5 }}>
                    <Text style={{ color: 'grey' }}>After</Text>
                    <View style={{ paddingLeft: 5, paddingTop: 5 }}>
                      <View style={{ width: '100%', padding: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: 'grey', width: '50%' }}>Check In</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          { el.getOneCorrection && el.getOneCorrection.start_time
                              ? el.getOneCorrection.start_time
                              : ' - '}
                        </Text>
                      </View>
                      <View style={{ width: '100%', padding: 1, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12, color: 'grey', width: '50%' }}>Check Out</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          { el.getOneCorrection && el.getOneCorrection.end_time
                              ? el.getOneCorrection.end_time
                              : ' - '}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={{ height: '50%', width: '100%', padding: 5 }}>
                    <Text style={{ fontSize: 13, color: 'grey', height: '13%' }}>More Info</Text>
                    <View style={{ height: '87%', width: '100%' }}>
                      <View style={{ height: '50%', width: '100%', alignItems: 'center' }}>
                        { el.getOneCorrection.image
                            ? <Image source={{ uri: el.getOneCorrection.image }} style={{ height: '97%', width: '50%' }} />
                            : <Text style={{ fontSize: 20, color: 'red', fontWeight: 'bold' }}>No Image</Text> }
                      </View>
                      <View style={{ height: '50%', width: '100%', alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ fontSize: 12, color: 'grey' }}>Reason Correction</Text>
                        { el.getOneCorrection.reason
                            ? <Text style={{ marginTop: 2, fontSize: 12 }}>{ el.getOneCorrection.reason }</Text>
                            : <Text style={{ marginTOp: 2, fontSIze: 12 }}>No Reason</Text> }
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ width: '50%', height: '100%', padding: 5 }}>
                  <View style={{ height: '50%', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    { el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_location && el.getOneCorrection.AttId.end_location
                        ? <MapCorrections start={ el.getOneCorrection.AttId.start_location } end={ el.getOneCorrection.AttId.end_location } />
                        : <Text style={{ fontWeight: 'bold', color: 'red' }}>NO LOCATION</Text>}
                  </View>
                  <View style={{ height: '50%' }}>
                    <View style={{ height: '50%', width: '100%', flexDirection: 'row', padding: 5 }}>
                      <View style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        { el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_image
                            ? <Image source={{ uri: el.getOneCorrection.AttId.start_image }} style={{ width: '95%', height: '95%' }} />
                            : <Text style={{ fontWeight: 'bold', color: 'salmon', fontSize: 18 }}>No Image</Text>}
                      </View>
                      <View style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        { el.getOneCorrection.AttId && el.getOneCorrection.end_image 
                            ? <Image source={{ uri: el.getOneCorrection.AttId.end_image }} style={{ width: '95%', height: '95%' }} />
                            : <Text style={{ fontWeight: 'bold', color: 'salmon', fontSize: 18, textAlgin: 'center' }}>No Image</Text>}
                      </View>
                    </View>
                    <View style={{ width: '100%', padding: 5, height: '50%' }}>
                      <View style={{ width: '97%', alignItems: 'center', height: '40%', marginTop: 2 }}>
                        <Text style={{ fontSize: 13, color: 'grey' }}>Start Reason</Text>
                        { el.getOneCorrection.AttId && el.getOneCorrection.AttId.start_reason
                            ? <Text style={{ fontSize: 13 }}>{ el.getOneCorrection.AttId.start_reason }</Text>
                            : <Text style={{ fontSize: 13 }}>No Reason</Text>}
                      </View>
                      <View style={{ width: '97%', alignItems: 'center', height: '40%', marginTop: 2 }}>
                        <Text style={{ fontSize: 13, color: 'grey' }}>End Reason</Text>
                        { el.getOneCorrection.reason
                            ? <Text style={{ fontSize: 13 }}>{ el.getOneCorrection.reason }</Text>
                            : <Text style={{ fontSize: 13 }}>No Reason</Text>}
                      </View>
                    </View>
                  </View>
                </View>
                
              </View>
              <View style={{ height: '20%', width: '100%', paddingBottom: 10, flexDirection: 'row' }}>
                <View style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  { !acceptLoading
                      ? <TouchableOpacity style={{ width: '80%', height: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowOpacity: 2, backgroundColor: '#a7e9af' }}>
                          <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>Accept</Text>
                        </TouchableOpacity>
                      : <View style={{ width: '80%', height: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowOpacity: 2, backgroundColor: '#a7e9af' }}>
                          <ActivityIndicator color='black' size='small' />
                        </View>}
                  
                </View>
                <View style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  { !rejectLoading
                      ? <TouchableOpacity style={{ width: '80%', height: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowOpacity: 2, backgroundColor: '#fd5e53' }}>
                          <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Reject</Text>
                        </TouchableOpacity>
                      : <TouchableOpacity style={{ width: '80%', height: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowOpacity: 2, backgroundColor: '#fd5e53' }}>
                          <ActivityIndicator color='white' size='small' />
                        </TouchableOpacity>}
                  
                </View>
              </View>
            </>
            : !loading && !message
                ? <Text>Empty Data</Text>
                : null }
        
      </FadeInView>
    </View>
  )
}

// 18 feb melanjutkan action accept or reject 