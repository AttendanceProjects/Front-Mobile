import React from 'react';
import { View, Text, Platform } from 'react-native';
import { HistoryStyle } from './HistoryStyle';

const {
  history_top_container,
  history_body
} = HistoryStyle

export const TopListComponent = ({ typeParent, size, justy }) => (
  <>
    <View style={{ ...history_top_container, justifyContent: justy ? justy : 'space-around' }}>
      <View style={ history_body }>
        <Text style={{ fontSize: size.name, fontWeight: 'bold' }}>{ typeParent && typeParent.username ? typeParent.username.toUpperCase() : null }</Text>
        <Text style={{ fontSize: size.role, fontWeight: 'bold' }}>{ typeParent.role }</Text>
      </View>
    </View>
    <View style={{ marginBottom: 5 }}>
      <Text style={{ fontSize: size.date, fontWeight: 'bold' }}>{ typeParent.date }</Text>
    </View>
  </>
)