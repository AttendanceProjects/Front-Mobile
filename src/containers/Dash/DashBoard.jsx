import React, { useState, useEffect } from 'react';
import { HeaderComponent, ListComponent } from '../../components/Spam'
import { View, Text, AsyncStorage, Platform, ScrollView } from 'react-native';
import { getAccess } from '../../service';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks';

export const Dash = ({ navigation }) => {
  const [ fetch, { data: Attendance } ] = useLazyQuery( Query.USER_ATT );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );

  useEffect(() => {
    (async() => {
      const { code, token } = await getAccess();
      fetch({ variables: { code, token } })
    })()
  }, [])

console.log( Attendance )
  return (
    <>
      <HeaderComponent
        right={{ icon: 'sign-out-alt', size: 20, nav: navigation.navigate, top: Platform.OS === 'android' ? 6 : 2 }}
        mid={{ msg: 'Presence', ls: 2 }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 20 : 25 }}>ACTIVITY TODAY</Text>
          {
            Attendance
              &&
                <>
                  {
                    Attendance.userAtt
                      ?
                        <ListComponent
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
                          id={ Attendance._id }
                          type={ 'checkout' }
                          />
                        : 
                          <ListComponent
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
                            />
                  }
                </>
          }
        </View>
      </ScrollView>
    </>
  )
}