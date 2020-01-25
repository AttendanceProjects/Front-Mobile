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
                mr={ Platform.OS === 'android' ? -15 : -10 }
                size={{
                  role: Platform.OS === 'android' ? 10 : 13,
                  time: Platform.OS === 'android' ? 18 : 24,
                  name: Platform.OS === 'android' ? 13 : 15,
                  date: Platform.OS === 'android' ? 15 : 20
                }}
                typeParent={{
                  date: his.date,
                  image: {
                    start: his.start_image
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
                  message,
                  empty: UserHistory.getHistory.length > 0 ? false : true,
                  action: () => checkLoc({ start: his.start_location, end: his.end_location })
                }}
              />
            ))
      }
    </View>
  )
}