import React, { useState, useEffect } from 'react';
import { HeaderComponent, ListComponent, ErrorGlobal, OfflieHeaderComponent, StartReasonComponent } from '../../components'
import { View, Text, Platform, ScrollView, AsyncStorage, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [ days ] = useState( ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] )
  const [ currentTime, setCurrentTime ] = useState( '' );
  const [ currentDay, setCurrentDays ] = useState( '' );
  const [ msg, setMsg ] = useState( false );
  const [ startReason, setStartReason ] = useState( false );
  const [ errorReason, setErrorReason ] = useState( false );

  const [ isOnline, setIsOnline ] = useState( true );


  useEffect(() => {
    (async() => {
      setInterval(() => {
        getCurrentTime({ setTime: setCurrentTime, setDay: setCurrentDays, days });
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
  
  const goAbsent = () => {
    if( startReason.length < 8 ) {
      setErrorReason( 'Your reason invalid, min 8 char' );
      setTimeout(() => setErrorReason( false ), 5000)
    }
    else {
      navigation.navigate( 'Absent', { startReason } )
      setErrorReason( false );
      setMsg( false );
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    const { msg } = await fetching();
    console.log( msg, 'refresh msg' );
    console.log( 'masuk refresh' );
    setTimeout(() => setRefresh( false ), 2000 )
  }, [refreshing]);

  // console.log( Att, 'attendance' );
  // console.log( DailyUser, 'daily' );

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      {/* <HeaderComponent
        online={ isOnline }
        mid={{ msg: 'Presence', ls: 2 }}
        left={{ icon: Platform.OS === 'android' ? 'arrow-left' : 'arrow-left', top: Platform.OS === 'android' ? 10 : 1, action: navigation.goBack }} /> */}
      <ScrollView style={{ backgroundColor: '#26282b' }} refreshControl={ Platform.OS === 'ios' ? <Text><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /></Text> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
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
                <Text style={{ marginTop: 10 }}>{ Att && Att.userAtt ? Att.userAtt.start : ' - ' }</Text>
              </View>
              <View style={ styles.ViewAttCheck }>
                <Text style={{ fontSize: 20 }}>Check Out</Text>
                <Text style={{ marginTop: 10 }}>{ Att && Att.userAtt ? Att.userAtt.end : ' - ' }</Text>
              </View>
            </View>
            <View style={ styles.ViewButton }>
              <TouchableOpacity style={ styles.CheckButton } onPress={() => navigation.navigate( 'PreCheck', { name: 'checkin' } )}>
                 <Text style={{ color: 'white', fontWeight: 'bold' }}>{ Att && Att.userAtt && Att.userAtt.start ? ' Done ' : ' Check In ' }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ styles.CheckButton } onPress={() => navigation.navigate( 'PreCheck', { name: 'checkout' } )}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{ Att && Att.userAtt && Att.userAtt.end ? ' Done ' : ' Check Out ' }</Text>
              </TouchableOpacity>
            </View>
          </View>
          { msg && <StartReasonComponent err={ errorReason } set={ setStartReason } reason={ startReason } action={ goAbsent }/> }
          { error && <ErrorGlobal text={ error } /> }
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  ViewContentAttTime: {
    height: 400,
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