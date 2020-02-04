import React, { useState, useEffect } from 'react';
import { HeaderComponent, ListComponent, ErrorGlobal, OfflieHeaderComponent, StartReasonComponent } from '../../components'
import { View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { getAccess, checkConnection } from '../../service';
import { Query } from '../../graph';
import { _getCurrentLocation, getCurrentTime } from '../../helpers'
import { useLazyQuery } from '@apollo/react-hooks';

export const LiveAttContainers = ({ navigation }) => {
  const [ fetch, { data: Att } ] = useLazyQuery( Query.USER_ATT );
  const [ getDailyUser, { data: DailyUser } ] = useLazyQuery( Query.GET_DAILY_USER );
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
      console.log( msg, 'useeffect' )
      setLoading( false );
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
    const { msg } = await fetching();
    console.log( msg, 'refresh msg' );
    console.log( 'masuk refresh' );
    setTimeout(() => setRefresh( false ), 2000 )
  }, [refreshing]);

  // console.log( Att, 'attendance' );
  // console.log( DailyUser, 'daily' );

  const _onCheckin = () => {
    console.log( 'trigger' );
    setMsg( false );
    let date
    if( Platform.OS === 'android' ) date = new Date().toLocaleTimeString().split(':')[0];
    else date = new Date().toLocaleTimeString().split('.')[0];
    console.log( date );
    if( date < 8 ) {
      navigation.navigate( 'Checkin' );
      setStartReason( '' );
    }else if( !startReason ) {
      console.log( msg );
      console.log( 'masuk kondisi kedua' );
      setMsg( true );
    }else if( startReason.length < 8 ){
      console.log( 'kondisi kedua' );
      setErrorReason( 'Your Reason invalid, min 8 Char' );
      setTimeout(() => setErrorReason( false ), 5000 );
      console.log( 'else' );
    }else {
      console.log( 'masuk kondisi ke else' );
      navigation.navigate( 'Checkin', { startReason } );
      setStartReason( '' );
    }
  }

  const _onCheckout = () => {
    let date 
    if( Platform.OS === 'android' ) date = new Date().toLocaleTimeString().split(':')[0];
    else date = new Date().toLocaleTimeString().split('.')[0];
    console.log( date, '---' );
    console.log( 'masuk')
    if( Number( date ) > 17 ) {
      console.log( 'masuk sini' );
      navigation.navigate( 'Checkout', { id: Att.userAtt._id } );
      setStartReason( '' );
    }
    else if( date < 17 ) {
      setOut( true );
      console.log( 'masuk kedua')
    }
    else if( startReason.length < 8 ) {
      console.log( 'masuk ketiga' );
      setErrorReason( 'Your Reason invalid, min 8 Char' );
      setTimeout(() => setErrorReason( false ), 5000 );
    }else {
      console.log( 'masuk else' )
      console.log( Att.userAtt, 'user' );
      navigation.navigate( 'Checkout', { id: Att.userAtt._id, issues: startReason } )
      setStartReason( '' );
    }
    // if( )
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
            </View>
            { msg || msgOut
                ?
                  <View style={{ width: '100%', marginTop: 15, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput keyboardType='default' autoCapitalize='none' placeholder={ ` ${ msg ? "You\'re late" : "To fast checkout" }, input your reason` } placeholderTextColor={ 'red' } style={{ height: Platform.OS === 'ios' && 25, backgroundColor: '#f1f1f6', textAlign: 'center', borderRadius: 10, color: 'black', fontWeight: 'bold', width: '80%' }} onChangeText={msg => setStartReason( msg )} value={ startReason }/>
                    {errorReason && <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}>{ errorReason }</Text> }
                  </View> : null }
            { error && <ErrorGlobal text={ error } /> }
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

/**
 * <ListComponent
                          ml={ Platform.OS === 'android' ? 35 : 10 }
                          size={{
                            role: Platform.OS === 'android' ? 10 : 13,
                            time: Platform.OS === 'android' ? 20 : 24,
                            name: Platform.OS === 'android' ? 13 : 15,
                            date: Platform.OS === 'android' ? 10 : 12
                          }}
                          name={ Attendance.userAtt.UserId.username.toUpperCase() }
                          role={ Attendance.userAtt.UserId.role }
                          startTime={ Attendance.userAtt.start }
                          date={ Attendance.userAtt.date }
                          image={ Attendance.userAtt.start_image }
                          message={ 'Check Out' }
                          action={ navigation.navigate }
                          startIssues={ Attendance.userAtt.start_issues }
                          id={ Attendance.userAtt._id }
                          type={ 'checkout' }
                          load={ loading }
                          />
                        : 
                          <ListComponent
                            ml={ Platform.OS === 'android' ? 35 : 10 }
                            size={{
                              role: Platform.OS === 'android' ? 10 : 13,
                              time: Platform.OS === 'android' ? 20 : 24,
                              name: Platform.OS === 'android' ? 13 : 15,
                              date: Platform.OS === 'android' ? 10 : 12
                            }}
                            startTime={ 'let\'s work' }
                            message={ 'Check In' }
                            action={ navigation.navigate }
                            type={ 'checkin' }
                            daily={ DailyUser && DailyUser.dailyUser.msg }
                            setMsg={ setMsg }
                            />
 */