import React, { useState, useEffect } from 'react';
import { HeaderComponent, ListComponent, ErrorGlobal, OfflieHeaderComponent } from '../../components/Spam'
import { View, Text, Platform, ScrollView } from 'react-native';
import { getAccess, checkConnection } from '../../service';
import { Query } from '../../graph';
import { _getCurrentLocation, getCurrentTime } from '../../helpers'
import { useLazyQuery } from '@apollo/react-hooks';

export const Dash = ({ navigation }) => {
  const [ fetch, { data: Attendance } ] = useLazyQuery( Query.USER_ATT );
  const [ getDailyUser, { data: DailyUser } ] = useLazyQuery( Query.GET_DAILY_USER );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ days ] = useState( ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] )
  const [ currentTime, setCurrentTime ] = useState( '' );
  const [ currentDay, setCurrentDays ] = useState( '' );

  const [ isOnline, setIsOnline ] = useState( true )


  useEffect(() => {
    (async() => {
      setInterval(() => {
        getCurrentTime({ setTime: setCurrentTime, setDay: setCurrentDays, days });
      }, 1000);
      await setIsOnline({ save: setIsOnline });
      setLoading( true );
      const { code, token } = await getAccess();
      try {
        await fetch({ variables: { code, token } });
        await getDailyUser({ variables: { code, token } });
      }catch({ graphQLErrors }) { setError( graphQLErrors[0].message ) }
      setLoading( false );
    })()
  }, [])


  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }

      <HeaderComponent
        online={ isOnline }
        right={{ icon: 'sign-out-alt', size: 20, nav: navigation.navigate, top: Platform.OS === 'android' ? 6 : 2 }}
        mid={{ msg: 'Presence', ls: 2 }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} />
      <ScrollView style={{ flex: 1, backgroundColor: '#26282b' }}>
        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#90b8f8', fontSize: Platform.OS === 'android' ? 20 : 25 }}>ACTIVITY TODAY</Text>
          <Text style={{ fontSize: 20, color: '#2196f3', fontWeight: 'bold' }}>{ currentDay }</Text>
          <Text style={{ fontSize: 30, color: '#f44336' }}>{ currentTime && currentTime.split(' ')[0] } { currentTime && currentTime.split(' ')[1].toUpperCase() }</Text>
          {
            Attendance
              &&
                <>
                  {
                    Attendance.userAtt
                      ?
                        <ListComponent
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
                            />
                  }
                </>
          }
          { error && <ErrorGlobal text={ error } /> }
        </View>
      </ScrollView>
    </>
  )
}