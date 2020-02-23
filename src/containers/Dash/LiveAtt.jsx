import React, { useState, useEffect } from 'react';
import { OfflieHeaderComponent, LoadingListComponent } from '../../components'
import { View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { getAccess, checkConnection, getServerTime, uploadImage } from '../../service';
import { Query, Mutation } from '../../graph';
import { _getCurrentLocation, getCurrentTime } from '../../helpers'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Font from 'react-native-vector-icons/FontAwesome5';

import { ContainerStyle } from './ContainerStyle';

const {
  live_time,
  live_time_date,
  live_time_time,
  live_content,
  live_content_body,
  live_content_header,
  font_check,
  live_font_small,
  live_main,
  live_main_body,
  live_button_content,
  live_button,
  live_button_text,
  live_offline_loading,
  live_message_content,
  live_time_loading,
  live_reason,
  font_small,
  font_medium,
  live_footer_content,
  live_footer_main,
  live_footer_text,
  live_schedule,
  live_footer_context,
  live_footer_context_main,
  live_touchable_history,
  live_logged_content,
  logged_text,
  context_empty
} = ContainerStyle;

export const LiveAttContainers = ({ navigation: { navigate: push } }) => {
  const [ fetch, { data: Att, loading} ] = useLazyQuery( Query.USER_ATT, { fetchPolicy: 'network-only' } );
  const [ getDailyUser, { data: DailyUser } ] = useLazyQuery( Query.GET_DAILY_USER , { fetchPolicy: 'network-only' });
  const [ getCompany, { data: company } ]  = useLazyQuery( Query.GET_COMPANY );
  const [ refreshing, setRefresh ] = useState( false );
  const [ newDate ] = useState( new Date () );
  const [ currentTime, setCurrentTime ] = useState( '' );
  const [ msg, setMsg ] = useState( false );
  const [ msgOut, setOut ] = useState( false );
  const [ timeLoading, setTimeLoading ] = useState( false );
  const [ startReason, setStartReason ] = useState( '' );
  const [ errorReason, setErrorReason ] = useState( false );

  const [ isOnline, setIsOnline ] = useState( false );
  const [ offlineLoading, setOfflineLoading ] = useState( false );
  const [ offlineCheckin ] = useMutation( Mutation.CREATE_ATT_OFFILE );
  const [ offlineCheckout ] = useMutation( Mutation.UPDATE_ATT_OFFLINE );

  const [ upLocation ] = useMutation( Mutation.UPDATE_LOCATION );


  useEffect(() => {
    (async () => {
      var timer = setInterval(() => {
        getCurrentTime({ setTime: setCurrentTime });
      }, 1000);
      const { network } = await checkConnection();
      setIsOnline( network );
      await fetching();

      return () => {
        clearInterval( timer )
      }
    })()
  }, [])


  const fetching = async () => {
    const { code, token } = await getAccess();
    return Promise.all([
      _fetchUser({ code, token }),
      _fetchDaily({ code, token }),
      _fetchCompany({ code, token })
    ])
  }



  const _fetchUser = ({ code, token }) => fetch({ variables: { code, token } })

  const _fetchDaily = ({ code, token }) => getDailyUser({ variables: { code, token } });

  const _fetchCompany = ({ code, token }) => getCompany({ variables: { code, token } });

  const _onRemoveAsync = async _ => await AsyncStorage.removeItem( 'offline' );

  const _onOfflineCreateAtt = ({ code, token, start_image, time }) => {
    return new Promise (resolve => {
      offlineCheckin({ variables: { code, token, start_image, start_reason: 'checkin offilemode', clock: time }, refetchQueries: [{ query: Query.GET_HISTORY, variables: { code, token }}, {query: Query.GET_DAILY_USER, variables: { code, token } }] })
        .then(({ data }) => {
          resolve({ id: data.createOffline._id })
        })
        .catch(({ graphQLErrors }) => resolve({ error: graphQLErrors[0].message }))
    })
  }

  const _onOfflineUpdateAtt = ({ code, token, end_image, clock, id }) => {
    return new Promise (resolve => {
      offlineCheckout({ variables: { code, token, end_image, clock, id } })
        .then(({ data }) => resolve({ id: data.updateOffline._id }))
        .catch(({ graphQLErrors }) => resolve({ error: graphQLErrors[0].message }))
    })
  }

  const _processAsync = async (type, location, url, clock, id) => {
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
        }else{ alert('please login again'); setTimeout(() => push( 'Signin' ), 2000); setOfflineLoading( false ) }
      }catch({ graphQLErrors }) { setErrorReason( graphQLErrors[0].message ); setOfflineLoading( false ); }
    }else {
      setOfflineLoading( true );
      try{
        const { code, token } = await getAccess();
        if( code, token ) {
          const { success, error: imageError } = await uploadImage({ code, token, url });
          if( success ) {
            const { id: resultId, error: offlineError } = await _onOfflineUpdateAtt({ code, token, end_image: success, clock, id });
            if( resultId ) {
              const { data } = await upLocation({ variables: { code, token, id: resultId, reason: 'offline', longitude: String( location.longitude ), latitude: String( location.latitude ), accuracy: String( location.accuracy ) }} ) // mungkin butuh refetchQuery
              if( data ) {
                setOfflineLoading( false );
                alert( 'thankyou, your data successfully save!');
                await _onRemoveAsync();
              }
            }else alert( offlineError )
          }else alert( imageError );
        }else{
          alert("please signin again");
          setTimeout(() => push( 'Signin' ), 2000);
          setOfflineLoading( false );
        }
      }catch({ graphQLErrors }) { setErrorReason( graphQLErrors[0].message ); setOfflineLoading( false ); }
    }
  }


  useEffect(() => {
    (async() => {
      const offline = await AsyncStorage.getItem('offline');
      if( offline ) {
        const { location, url, time, type, id } = await JSON.parse( offline );
        Alert.alert('You have request offline mode',`
Time => ${ time }
For => ${ type }
location => longitude: ${ location.longitude }, latitude: ${ location.latitude }
id => ${ id ? id : 'check in' }
Do you want proccess?
        `,
        [
          {
            text: 'No',
            onPress: async () => await _onRemoveAsync()
          },
          {
            text: 'Yes',
            onPress: async () => await _processAsync( type, location, url, time )
          }
        ])
      }
    })()
  }, [ isOnline ])
  

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await fetching();
    setRefresh( false );
  }, [ refreshing ]);

  const _onCheckin = async () => {
    setOut( false );
    setErrorReason( false );
    const { network } = await checkConnection();
    setIsOnline( network );
    if( network ) {
      const { code, token } = await getAccess();
      setTimeLoading( true );
      const { time, error } = await getServerTime({ code, token });
      if( time ) {
        if( (time.split(':')[0] < 8 && time.split(' ')[1] === 'AM') || (startReason && startReason.length > 7) ) {
          push( 'Checkin', { startReason });
          setStartReason( '' );
          setMsg( false );
        }else if( startReason && startReason.length < 8 ) {
          setErrorReason( 'Your Reason invalid, min 8 Char' );
          setTimeout(() => setErrorReason( false ), 5000);
        }else setMsg( true );
        setTimeLoading( false );
      }else setErrorReason( error );
    }else push( 'Checkin' );
  }

  const _onValidateCheckin = _ => {
    if( Att && Att.userAtt && Att.userAtt.start ) alert( 'Allready Checkin' );
    else _onCheckin();
  }

  const _onCheckout = async () => {
    setMsg( false );
    setOut( false );
    setErrorReason( false );
    const { network } = await checkConnection();
    setIsOnline( network );
    if( network ) {
      const { code, token } = await getAccess();
      setTimeLoading( true );
      const { time, error } = await getServerTime({ code, token });
      if( time ) {
        if( time.split(':')[0] > 5 && time.split(' ')[1] === 'PM' || startReason && startReason.length > 7 ) {
          push( 'Checkout', { id: Att.userAtt._id, issues: startReason ? startReason : '' });
          setTimeLoading( false );
          setStartReason( '' );
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
    }else push( 'Checkout', { id: Att.userAtt._id , issues: 'offline'} );
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
          <View style={ live_time }>
            <Text style={ live_time_time }>{ currentTime && currentTime.toUpperCase() }</Text>
            <Text style={ live_time_date }>{ newDate.toDateString () }</Text>
          </View>
          <View style={ live_content }>
            <View style={ live_content_body }>
              {
                loading
                  ? <LoadingListComponent color={ 'blue' } bg={ 'white' } />
                  :
                  <>
                    <View style={ live_content_header }>
                      <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}>Attendance Time</Text>
                    </View>
                    <View style={ live_main }>
                      <View style={ live_main_body }>
                        <Text style={ font_check }>Check In</Text>
                        <Text style={{ ...live_font_small, color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black' }}>{ Att && Att.userAtt && Att.userAtt.start && Att.userAtt.start ? Att.userAtt.start : ' - ' }</Text>
                      </View>
                      <View style={ live_main_body }>
                        <Text style={ font_check }>Check Out</Text>
                        <Text style={{ ...live_font_small, color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black'  }}>{ Att && Att.userAtt && Att.userAtt.end && Att.userAtt.end ? Att.userAtt.end : ' - ' }</Text>
                      </View>
                    </View>
                    <View style={ live_button_content }>
                      { DailyUser && DailyUser.dailyUser || !isOnline
                          ?
                          <>
                            <TouchableOpacity style={ live_button } onPress={() => _onValidateCheckin()}>
                              <Text style={ live_button_text }>{ (Att && Att.userAtt && Att.userAtt.start) ? ' Done ' : ' Check In ' }</Text>
                            </TouchableOpacity>
                            {
                              DailyUser && DailyUser.dailyUser && DailyUser.dailyUser.msg === 'ok' || !isOnline
                                ?
                                <TouchableOpacity style={ live_button } onPress={() => _onValidateCheckout()}>
                                  <Text style={ live_button_text }>{ Att && Att.userAtt && Att.userAtt.end ? ' Done ' : ' Check Out ' }</Text>
                                </TouchableOpacity>
                                : null
                            }
                          </>
                          : <View>
                              <ActivityIndicator color='blue' />
                            </View>
                        }
                      
                    </View>
                  </>
              }
            { offlineLoading
                && <View style={ live_offline_loading }>
                    <ActivityIndicator color='blue' size='small' />
                  </View>}
            </View>
            { msg || msgOut
                  ?
                    <View style={ live_message_content }>
                      { timeLoading
                          ? 
                            <View style={ live_time_loading }>
                              <ActivityIndicator color='black' /> 
                            </View>
                          : <>
                              <TextInput
                                keyboardType='default'
                                keyboardAppearance='dark'
                                autoCapitalize='none'
                                placeholder={ ` ${ msg ? "You\'re late" : "To fast checkout" }, input your reason` }
                                placeholderTextColor={ 'red' }
                                style={ live_reason }
                                onChangeText={msg => setStartReason( msg )} value={ startReason }
                              />
                              { errorReason && <Text style={{ ...font_small, color: 'red' }}>{ errorReason }</Text> }
                            </> }
                      
                    </View> : null }
            <View style={ live_footer_content }>
              <View style={ live_footer_main }>
                <Text style={ live_footer_text }>Schedule Today</Text>
                <View style={ live_schedule }>
                  <Font name='clock' size={ 15 } />
                  <Text style={{ fontWeight: 'bold' }}>
                    { company && company.getCompany && new Date().toDateString().split(' ')[0] !== 'Sun'
                        ? company.getCompany.start
                        : ' - ' }
                  </Text>
                  <Text style={{ color: 'grey' }}> - </Text>
                  <Text style={{ fontWeight: 'bold' }}>
                    { company && company.getCompany && new Date().toDateString().split(' ')[0] !== 'Sun'
                        ? company.getCompany.end
                        : ' - '}
                  </Text>
                </View>
              </View>
              <View style={ live_footer_context }>
                <View style={ live_footer_context_main }>
                  <Text style={ font_medium }>{ new Date().toDateString().replace(' ',', ') }</Text>
                  <TouchableOpacity style={ live_touchable_history }>
                    <Text style={{ ...font_medium, color: 'white' }}>History</Text>
                  </TouchableOpacity>
                </View>
                { Att && Att.userAtt && !loading
                    ? <>
                        <View style={ live_logged_content }>
                          <Text style={ font_medium }>{ Att.userAtt.start ? Att.userAtt.start : ' - ' }</Text>
                          <Text style={ logged_text }>Check In</Text>
                        </View>
                        <View style={ live_logged_content }>
                          <Text style={ font_medium }>{ Att.userAtt.end ? Att.userAtt.end : ' - ' }</Text>
                          <Text style={ logged_text }>Check Out</Text>
                        </View>
                         
                      </>
                    : loading
                        ? <View style={{ width: '100%', alignItems: 'center' }}>
                            <ActivityIndicator color='blue' />
                          </View>
                        :
                          <View style={ context_empty }>
                            <Text style={{ fontWeight: 'bold' }}>No Activities Today</Text>
                            <Text>-- Activities will appear here per day --</Text>
                          </View> }
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}