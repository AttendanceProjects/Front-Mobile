import React, { useState, useEffect } from 'react';
import { ErrorCheckInOutComponent, OfflieHeaderComponent, StartReasonComp, ErrorCheckInOutComponentonent, LoadingListComponent } from '../../components'
import { View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { getAccess, checkConnection, getServerTime, uploadImage } from '../../service';
import { Query, Mutation } from '../../graph';
import { _getCurrentLocation, getCurrentTime } from '../../helpers'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

var abortController = new AbortController()

export const LiveAttContainers = ({ navigation }) => {
  const [ fetch, { data: Att } ] = useLazyQuery( Query.USER_ATT, { fetchPolicy: 'network-only' } );
  const [ getDailyUser, { data: DailyUser } ] = useLazyQuery( Query.GET_DAILY_USER , { fetchPolicy: 'network-only' });
  const [ access, setAccess ] = useState( {} );
  const [ refreshing, setRefresh ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ newDate ] = useState( new Date () );
  const [ currentTime, setCurrentTime ] = useState( '' );
  const [ msg, setMsg ] = useState( false );
  const [ msgOut, setOut ] = useState( false );
  const [ timeLoading, setTimeLoading ] = useState( false );
  const [ startReason, setStartReason ] = useState( '' );
  const [ errorReason, setErrorReason ] = useState( false );

  const [ isOnline, setIsOnline ] = useState( true );
  const [ offlineLoading, setOfflineLoading ] = useState( false );
  const [ offlineCheckin ] = useMutation( Mutation.CREATE_ATT_OFFILE );
  const [ offlineCheckout ] = useMutation( Mutation.CHECK_OUT_ATT );

  const [ upLocation ] = useMutation( Mutation.UPDATE_LOCATION );

  useEffect(() => {
    (async () => {
      console.log( 'trigger use effect pertama liveatt' );
      setInterval(() => {
        getCurrentTime({ setTime: setCurrentTime });
      }, 1000);
      await checkConnection({ save: setIsOnline });
      setLoading( true );
      await fetching();
      setLoading( false );

      return () => abortController.abort();
    })()
  }, [])

  const fetching = async () => {
    const { code, token } = await getAccess();
    setAccess({ code, token });
    return Promise.all([
      fetchUser({ code, token }),
      fetchDaily({ code, token })
    ], { signal: abortController.signal })
  }

  const fetchUser = ({ code, token }) => fetch({ variables: { code, token } })

  const fetchDaily = ({ code, token }) => getDailyUser({ variables: { code, token } })

  const _onRemoveAsync = async _ => await AsyncStorage.removeItem( 'access' );

  const _onOfflineCreateAtt = ({ code, token, start_image, time }) => {
    return new Promise (resolve => {
      offlineCheckin({ variables: { code, token, start_image, start_reason: 'checkin offilemode', clock: time }, refetchQueries: [{ query: Query.GET_HISTORY, variables: { code, token }}, {query: Query.GET_DAILY_USER, variables: { code, token } }] })
        .then(({ data }) => {
          resolve({ id: data.createAtt._id })
        })
        .catch(({ graphQLErrors }) => resolve({ error: graphQLErrors[0].message }))
    })
  }

  const _processAsync = async (type, location, url, clock) => {
    if( type === 'checkin' ){
      setOfflineLoading( true );
      try {
        const { code, token } = await getAccess();
        if( code, token ) {
          const { success, error: imageError } = await uploadImage({ code, token, url });
          if( success ){
            const { id, error: checkError } = await _onOfflineCreateAtt({ code, token, start_image: success, clock });
            if ( id ) {
              const { data } = await upLocation({ variables: { code, token, id, reason: 'offline', longitude: String( location.longitude ), latitude: String( location.latitude ), accuracy: String( location.accuracy ) }} )//mngkin butuh refetch query
              if( data ) {
                setOfflineLoading( false );
                alert( 'thankyou, your data successfully save!')
                await _onRemoveAsync();
              }
            }else alert( checkError );
          }else alert( imageError );
          setOfflineLoading( false );
        }else{ alert('please login again'); setTimeout(() => navigation.navigate( 'Signin' ), 2000); setOfflineLoading( false ) }
      }catch({ graphQLErrors }) { console.log( graphQLErrors[0].message ); setOfflineLoading( false ); }
    }else {
      console.log( 'comming soon' );
    }
  }


  useEffect(() => {
    (async() => {
      const offline = await AsyncStorage.getItem('offline');
      if( offline ) {
        const { location, url, time, type } = await JSON.parse( offline );
        Alert.alert('You have request offline mode',`
Time => ${ time }
For => ${ type }
location => longitude: ${ location.longitude }, latitude: ${ location.latitude }
Do you want proccess?
        `,
        [
          {
            text: 'No',
            onPress: () => _onRemoveAsync()
          },
          {
            text: 'Yes',
            onPress: () => _processAsync( type, location, url, time )
          }
        ])
      }
    })()
  }, [ isOnline ])
  

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    setLoading( true );
    await fetching();
    setLoading( false );
    setRefresh( false );
  }, [refreshing]);

  const _onCheckin = async () => {
    setOut( false );
    setErrorReason( false );
    const { code, token } = access;
    if( isOnline ) {
      setTimeLoading( true );
      const { time, error } = await getServerTime({ code, token });
      if( time ) {
        console.log( 'time', time );
        if( time.split(':')[0] < 8 && time.split(' ')[1] === 'AM' || startReason && startReason.length > 7 ) {
          console.log( 'kondisi lolos' );
          navigation.navigate( 'Checkin', { startReason });
          setStartReason( false );
          setMsg( false );
        }else if( startReason && startReason.length < 8 ) {
          console.log( 'masuk kondisi invalid min 8 char' );
          setErrorReason( 'Your Reason invalid, min 8 Char' );
          setTimeout(() => setErrorReason( false ), 5000);
        }else setMsg( true );
        setTimeLoading( false );
      }else setErrorReason( error );
    }else navigation.navigate( 'Checkin' );
  }

  const _onValidateCheckin = _ => {
    if( Att && Att.userAtt && Att.userAtt.start ) alert( 'Allready Checkin' );
    else _onCheckin();
  }

  const _onCheckout = async () => {
    setMsg( false );
    setOut( false );
    setErrorReason( false );
    const { code, token } = access;
    if( isOnline ) {
      setTimeLoading( true );
      const { time, error } = await getServerTime({ code, token });
      if( time ) {
        if( time.split(':')[0] > 5 && time.split(' ')[1] === 'PM' || startReason && startReason.length > 7 ) {
          navigation.navigate( 'Checkout', { id: Att.userAtt._id, issues: startReason ? startReason : '' });
          setTimeLoading( false );
          setStartReason( false );
          setOut( false );
        }else if( startReason && startReason.length < 8 ) {
          setErrorReason( 'Your Reason invalid, min 8 Char' );
          setTimeLoading( false );
          setTimeout(() => setErrorReason( false ), 5000);
        }else {
          setOut( true );
          setTimeLoading( false );
        }
      }else {
        setErrorReason( error );
        setTimeLoading( false );
      }
    }else navigation.navigate( 'Checkout' );
  }

  const _onValidateCheckout = _ => {
    if( Att && Att.userAtt && Att.userAtt.end ) alert( 'Allready Checkout' );
    else _onCheckout();
  }

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <KeyboardAvoidingView behavior='position'>
        <ScrollView  style={{ backgroundColor: '#26282b' }} refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
          <View style={{ backgroundColor: '#90b8f8', height: 200, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#f44336' }}>{ currentTime && currentTime.toUpperCase() }</Text>
            <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20 }}>{ newDate.toDateString () }</Text>
          </View>
          <View style={ styles.ViewContentAttTime }>
            <View style={{ width: '99%', height: 160, borderWidth: 1, borderColor: '#f1f1f6' }}>
              {
                loading
                  ? <LoadingListComponent color={ 'blue' } bg={ 'white' } />
                  :
                  <>
                    <View style={{ width: '100%', backgroundColor: '#f1f1f6', alignItems: 'center', height: 30, justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}>Attendance Time</Text>
                    </View>
                    <View style={ styles.ViewUpAttCheck }>
                      <View style={ styles.ViewAttCheck }>
                        <Text style={{ fontSize: 20 }}>Check In</Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold', color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black' }}>{ Att && Att.userAtt && Att.userAtt.start && Att.userAtt.start ? Att.userAtt.start : ' - ' }</Text>
                      </View>
                      <View style={ styles.ViewAttCheck }>
                        <Text style={{ fontSize: 20 }}>Check Out</Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold', color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black'  }}>{ Att && Att.userAtt && Att.userAtt.end && Att.userAtt.end ? Att.userAtt.end : ' - ' }</Text>
                      </View>
                    </View>
                    <View style={ styles.ViewButton }>
                      { DailyUser && DailyUser.dailyUser || !isOnline
                          ?
                          <>
                            <TouchableOpacity style={ styles.CheckButton } onPress={() => _onValidateCheckin()}>
                              <Text style={{ color: 'white', fontWeight: 'bold' }}>{ (Att && Att.userAtt && Att.userAtt.start) ? ' Done ' : ' Check In ' }</Text>
                            </TouchableOpacity>
                            {
                              DailyUser && DailyUser.dailyUser && DailyUser.dailyUser.msg === 'ok' || !isOnline
                                ?
                                <TouchableOpacity style={ styles.CheckButton } onPress={() => _onValidateCheckout()}>
                                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{ Att && Att.userAtt && Att.userAtt.end ? ' Done ' : ' Check Out ' }</Text>
                                </TouchableOpacity>
                                : null
                            }
                          </>
                          : <View style={{ width: '100%', alignItems: 'center' }}>
                              <ActivityIndicator color='blue' />
                            </View>
                        }
                      
                    </View>
                  </>
              }
            </View>
            { offlineLoading
                && <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator color='blue' size='small' />
                  </View>}
            { msg || msgOut
                ?
                  <View style={{ width: '100%', marginTop: 15, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    { timeLoading
                        ? 
                          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color='black' /> 
                          </View>
                        : <>
                            <TextInput keyboardType='default' autoCapitalize='none' placeholder={ ` ${ msg ? "You\'re late" : "To fast checkout" }, input your reason` } placeholderTextColor={ 'red' } style={{ height: Platform.OS === 'ios' ? 25 : 25, backgroundColor: '#f1f1f6', textAlign: 'center', borderRadius: 10, color: 'black', fontWeight: 'bold', width: '80%' }} onChangeText={msg => setStartReason( msg )} value={ startReason }/>
                            { errorReason && <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}>{ errorReason }</Text> }
                          </> }
                    
                  </View> : null }
            { error && <ErrorCheckInOutComponent text={ error } /> }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  ViewContentAttTime: {
    height: Platform.OS === 'android' ? 500 : 400,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  CheckButton: {
    width: '35%',
    backgroundColor: '#192965',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 10
  },
  ViewButton: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  ViewAttCheck: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ViewUpAttCheck: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6'
  }
})