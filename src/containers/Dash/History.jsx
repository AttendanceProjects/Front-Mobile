import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { HeaderComponent, OfflieHeaderComponent, ListComponent, ErrorGlobal } from '../../components';
import { getAccess, checkConnection } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';

export const History = ({ navigation }) => {
  const [ history, { data: UserHistory } ] = useLazyQuery( Query.GET_HISTORY );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ isOnline, setIsOnline ] = useState( true );

  useEffect(() => {
    (async () => {
      setLoading( true );
      await checkConnection({ save: setIsOnline });
      const { code, token } = await getAccess();
      console.log( code, token );
      try {
        await history({ variables: { code, token } });
        setLoading( false );
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ) }
    })()
  }, [])

  const checkLoc = ({ start, end }) => {
    navigation.navigate( 'Maps', { start, end } );
  }

  console.log( UserHistory );

  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
      { !isOnline && <OfflieHeaderComponent /> }
      <HeaderComponent
        online={ isOnline }
        mid={{ msg: 'History', ls: 2, color: '#26282b' }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} 
        />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {
            UserHistory && UserHistory.getHistory.length > 0
              ? UserHistory.getHistory.map(his => (
                  <ListComponent
                    load={ loading }
                    bc= { '#c9485b' }
                    justy={ 'space-between' }
                    size={{
                      role: Platform.OS === 'android' ? 10 : 13,
                      time: Platform.OS === 'android' ? 18 : 24,
                      name: Platform.OS === 'android' ? 13 : 19,
                      date: Platform.OS === 'android' ? 15 : 20
                    }}
                    typeParent={{
                      date: his.date,
                      image: {
                        start: his.start_image,
                        end: his.end_image
                      },
                      username: his.UserId.username,
                      role: his.UserId.role,
                      name: 'history',
                      startTime: his.start,
                      startIssues: his.start_issues,
                      endTime: his.end,
                      endIssues: his.end_issues,
                      reason: {
                        end: his.end_reason
                      },
                      empty: UserHistory.getHistory.length > 0 ? false : true,
                      action: () => checkLoc({ start: his.start_location, end: his.end_location })
                    }}
                    nav={ navigation.navigate }
                  />
                ))
              : message
                  ? <ErrorGlobal text={ message } size={ 30 }/>
                  : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={ require('../../../assets/box-empty.png') } style={{ width: 150, height: 150 }} />
                      <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 50, letterSpacing: 2 }}>No History Saved</Text>
                    </View>
          }
        </View>
      </ScrollView>
    </View>
  )
}