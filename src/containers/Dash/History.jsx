import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { HeaderComponent } from '../../components/Spam';
import { getAccess } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';

export const History = ({ navigation }) => {
  const [ history, { data: UserHistory } ] = useLazyQuery( Query.GET_HISTORY );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );

  useEffect(() => {
    (async () => {
      setLoading( true );
      const { code, token } = await getAccess();
      console.log( code, token );
      try {
        await history({ variables: { code, token } })
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ) }
    })()
  }, [])

  return (
    <>
      <HeaderComponent
        mid={{ msg: 'History', ls: 2, color: 'green' }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} 
        />
    </>
  )
}