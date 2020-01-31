import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';
import { LoadingComponent } from '../../components';
import { getAccess } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';

export const FilterContainers = ({ navigation }) => {
  const [ selectName ] = useState([ {name: 'late', icon: 'running'}, {name: 'checkin', icon: 'sign-in-alt'}, {name: 'checkout', icon: 'sign-out-alt'}, {name: 'absent', icon: 'user-times'} ]);
  const [ loading, setLoading ] = useState( false );
  const [ getFilter, { data: filtering } ] = useLazyQuery( Query.FILTER_ATT );
  const [ errorMessage, setErrorMessage ] = useState( false );
  const [ selectQuery, setSelect ] = useState( 'late' );

  useEffect(() => {
    (async() => {
      if( selectQuery ) {
        try{
          const { code, token } = await getAccess();
          console.log( code, 'fdsafda' )
          await getFilter({ variables: { code, token, category: selectQuery } });
        }catch({ graphQLErrors }) { console.log( '-----------' ); console.log( graphQLErrors[0].message ); setErrorMessage( graphQLErrors[0].message ) }
      }
    })()
  }, [ selectQuery ])

  console.log( filtering );

  return (
    <View style={{ backgroundColor: '#353941', flex: 1, padding: 10, justifyContent: 'space-between' }}>
      <View style={{ flex: 0.12, backgroundColor: '#26282b', borderRadius: 20, borderBottomEndRadius: 80, borderTopStartRadius: 80, borderTopEndRadius: 0, borderBottomStartRadius: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        { selectName && selectName.map(el => (
          <TouchableOpacity style={{ flex: 0.24, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Font name={ el.icon } size={ 25 } color={ 'white' } />
            <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#ce0f3d' }}>{ el.name.toUpperCase() }</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 0.87, backgroundColor: 'green' }}>
        <LoadingComponent text={{ first: "Please Wait...", second: "Fetching Data" }} color={ 'red' }/>
      </View>
    </View>
  )
}