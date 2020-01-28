import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks';

export const DetailContainers = ({ navigation }) => {
  const [ history, { data } ] = useLazyQuery( Query.GET_HISTORY );

  useEffect(() => {
    (async() => {
      console.log( navigation.state.params );
      // const { code, token } = navigation.state.params.access;
      // history({ variables: { code, token } })
    })()
  }, [])
 
  return (
    <View>
      <Text>Detail Containers</Text>
    </View>
  )
}