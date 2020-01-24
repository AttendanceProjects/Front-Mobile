import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { HeaderComponent, OfflieHeaderComponent, ListComponent, LoadingComponent } from '../../components/Spam';
import { getAccess, checkConnection } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';

export const History = ({ navigation }) => {
  const [ history, { data: UserHistory } ] = useLazyQuery( Query.GET_HISTORY );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ isOnline, setIsOnline ] = useState( true );
  const [ empty, setEmpty ] = useState( false );

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

  return (
    <View style={{ flex: 1, backgroundColor: '#353941', alignItems: 'center' }}>
      { !isOnline && <OfflieHeaderComponent /> }
      <HeaderComponent
        online={ isOnline }
        mid={{ msg: 'History', ls: 2, color: '#26282b' }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} 
        />
      {
        UserHistory && UserHistory.getHistory
          && UserHistory.getHistory.map(his => (
              <ListComponent
                load={ loading }
                bc= { '#c9485b' }
                justy={ 'space-between' }
                mr={ Platform.OS === 'android' ? -10 : 4 }
                size={{
                  role: Platform.OS === 'android' ? 10 : 13,
                  time: Platform.OS === 'android' ? 18 : 24,
                  name: Platform.OS === 'android' ? 13 : 15,
                  date: Platform.OS === 'android' ? 15 : 20
                }}
                typeParent={{
                  date: his.createdAt,
                  image:'https://storage.googleapis.com/ptlda/1579875286422checkin.jpg',
                  username:'ericsudhartio',
                  role:'master',
                  name:'history',
                  startTime:'20:20:20 PM',
                  startIssues:'ok',
                  endTime:'21:21:21 PM',
                  endIssues: 'warning',
                  date:'Fri 25 Jan 2020',
                  reason:'telat ui',
                  message,
                  empty
                }}
              />
            ))
      }
    </View>
  )
}