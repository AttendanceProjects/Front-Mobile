import React, { useState, useEffect } from 'react';
import { ErrorCheckInOutComponent, OfflieHeaderComponent, StartReasonComp, ErrorCheckInOutComponentonent, LoadingListComponent } from '../../components'
import { View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { getAccess, checkConnection } from '../../service';
import { Query } from '../../graph';
import { _getCurrentLocation, getCurrentTime } from '../../helpers'
import { useLazyQuery } from '@apollo/react-hooks';

export const LiveAttContainers = ({ navigation }) => {
  const [ fetch, { data: Att } ] = useLazyQuery( Query.USER_ATT );
  const [ getDailyUser, { data: DailyUser } ] = useLazyQuery( Query.GET_DAILY_USER, { fetchPolicy: 'no-cache' } );
  const [ refreshing, setRefresh ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ newDate ] = useState( new Date () );
  const [ currentTime, setCurrentTime ] = useState( '' );
  const [ msg, setMsg ] = useState( false );
  const [ msgOut, setOut ] = useState( false );
  const [ startReason, setStartReason ] = useState( '' );
  const [ errorReason, setErrorReason ] = useState( false );

  const [ isOnline, setIsOnline ] = useState( true );


  useEffect(() => {
    (async() => {
      setInterval(() => {
        getCurrentTime({ setTime: setCurrentTime });
      }, 1000);
      await checkConnection({ save: setIsOnline });
      setLoading( true );
      const { msg } = await fetching();
      if( msg ){
        setLoading( false ); 
      }
    })()
  }, [])

  const fetching = async () => {
    const { code, token } = await getAccess();
    return new Promise((resolve, reject) => {
      try {
        fetch({ variables: { code, token }, fetchPolicy: 'network-only' });
        getDailyUser({ variables: { code, token }, fetchPolicy: 'network-only' });
        resolve({ msg: 'success' })
      }catch({ graphQLErrors }) { setError( graphQLErrors[0].message ) }
    })
  }


  useEffect(() => {
    (async() => {
      const offline = await AsyncStorage.getItem('offline');
      if( offline ) {
        const { location, url, time } = await JSON.parse( offline );
        console.log( 'masik simpan di local loation dan url pidturenya', location, url, time );
        console.log( 'masuk sini ?' )
      }
    })()
  }, [ isOnline ])
  

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    setLoading( true );
    const { msg } = await fetching();
    if( msg ) {
      setLoading( false );
      setRefresh( false );
    }
  }, [refreshing]);

  // console.log( Att, 'attendance' );
  // console.log( DailyUser, 'daily' );

  const _onCheckin = () => {
    setMsg( false );
    let date
    if( Platform.OS === 'android' ) date = new Date().toLocaleTimeString().split(':')[0];
    else date = new Date().toLocaleTimeString().split('.')[0];
    if( date < 8 ) {
      navigation.navigate( 'Checkin' );
      setStartReason( '' );
    }else if( !startReason ) {
      setMsg( true );
    }else if( startReason.length < 8 ){
      setErrorReason( 'Your Reason invalid, min 8 Char' );
      setTimeout(() => setErrorReason( false ), 5000 );
    }else {
      navigation.navigate( 'Checkin', { startReason } );
      setStartReason( '' );
    }
  }

  const _onCheckout = () => {
    let date 
    if( Platform.OS === 'android' ) date = new Date().toLocaleTimeString().split(':')[0];
    else date = new Date().toLocaleTimeString().split('.')[0];
    if( Number( date ) > 17 ) {
      navigation.navigate( 'Checkout', { id: Att.userAtt._id } );
      setStartReason( '' );
    }
    else if( date < 17 ) {
      setOut( true );
    }
    else if( startReason.length < 8 ) {
      setErrorReason( 'Your Reason invalid, min 8 Char' );
      setTimeout(() => setErrorReason( false ), 5000 );
    }else {
      navigation.navigate( 'Checkout', { id: Att.userAtt._id, issues: startReason } )
      setStartReason( '' );
    }
  }

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <KeyboardAvoidingView behavior='position'>
        <ScrollView  style={{ backgroundColor: '#26282b' }} refreshControl={ Platform.OS === 'ios' ? <Text><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /></Text> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
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
                        <Text style={{ marginTop: 10, color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black' }}>{ Att && Att.userAtt && Att.userAtt.start && Att.userAtt.start ? Att.userAtt.start : ' - ' }</Text>
                      </View>
                      <View style={ styles.ViewAttCheck }>
                        <Text style={{ fontSize: 20 }}>Check Out</Text>
                        <Text style={{ marginTop: 10, color: DailyUser && DailyUser.dailyUser.msg === 'ok' ? 'green' : 'black'  }}>{ Att && Att.userAtt && Att.userAtt.end && Att.userAtt.end ? Att.userAtt.end : ' - ' }</Text>
                      </View>
                    </View>
                    <View style={ styles.ViewButton }>
                      <TouchableOpacity style={ styles.CheckButton } onPress={ (Att && Att.userAtt && Att.userAtt.start) ? () => alert( 'Allready Checkin' ) : _onCheckin }>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{ (Att && Att.userAtt && Att.userAtt.start) ? ' Done ' : ' Check In ' }</Text>
                      </TouchableOpacity>
                      {
                        DailyUser && DailyUser.dailyUser && DailyUser.dailyUser.msg === 'ok'
                          ?
                          <TouchableOpacity style={ styles.CheckButton } onPress={ Att && Att.userAtt && Att.userAtt.end ? () => alert( 'Allready Checkout' ) : _onCheckout }>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{ Att && Att.userAtt && Att.userAtt.end ? ' Done ' : ' Check Out ' }</Text>
                          </TouchableOpacity>
                          : null
                      }
                    </View>
                  </>
              }
            </View>
            { msg || msgOut
                ?
                  <View style={{ width: '100%', marginTop: 15, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput keyboardType='default' autoCapitalize='none' placeholder={ ` ${ msg ? "You\'re late" : "To fast checkout" }, input your reason` } placeholderTextColor={ 'red' } style={{ height: Platform.OS === 'ios' && 25, backgroundColor: '#f1f1f6', textAlign: 'center', borderRadius: 10, color: 'black', fontWeight: 'bold', width: '80%' }} onChangeText={msg => setStartReason( msg )} value={ startReason }/>
                    {errorReason && <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}>{ errorReason }</Text> }
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