import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';
import { DashStyle } from './DashBoardStyle';

const {
  touchable_container_permission,
  font_content,
  content_detail,
  text_submit,
  text_name_submit
} = DashStyle

export const PermissionComponent = ({ type, w , action}) => (
  <TouchableOpacity
    onPress={() => action && action()}
    style={{ ...touchable_container_permission, width: w ? w : Platform.OS === 'android' ? 120 : 110 }}
    >
    <View style={ font_content }>
      <Font name={ type && type.icon ? type.icon : 'null' } size={ 20 } />
    </View>
    <View style={ content_detail }>
      <Text style={ text_submit }>Submit</Text>
      <Text style={ text_name_submit }>{ type && type.name ? type.name : null }</Text>
    </View>
  </TouchableOpacity>
)