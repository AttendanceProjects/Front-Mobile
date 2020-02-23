import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { EmployeeStyle } from './EmployeeStyle';

const {
  container_employee,
  content_image,
  image_profile,
  main_content,
  text_name,
  text_me,
  font_small,
  info_content,
  border_icon
} = EmployeeStyle

export const ListEmployeeComponent = ({ el, _onSendEmail, _onChatWa, i, username, _onCalling }) => (
  <View style={{ ...container_employee, marginTop: i !== 0 ? 10 : 0 }}>
    <View style={ content_image }>
      <Image source={ el.profile_image ? { uri: el.profile_image } : require('../../../assets/defaultImage.png' ) } style={ image_profile } />
    </View>
    <View style={ main_content }>
      <Text style={ text_name }>
        { el.username ? el.username.toUpperCase() : ' - ' }
        { username && el.username === username
            ? <Text style={ text_me }>
                Me
              </Text>
            : null }
      </Text>
      <Text style={{ marginTop: 10 }}>{ el.role ? el.role : ' - ' } &nbsp; <Text style={ font_small }>{ el.gender ? el.gender : ' - ' }</Text></Text>
    </View>
    <View style={ info_content }>
      <TouchableOpacity style={ border_icon } onPress={() => _onCalling({ phone: el.phone })}>
        <Font name={ 'phone' } color={ 'white' } size={ 20 }/>
      </TouchableOpacity>
      <TouchableOpacity style={ border_icon } onPress={() => _onSendEmail({ to: el.email && el.email })}>
        <Font name={ 'envelope' } color={ 'white' } size={ 20 } />
      </TouchableOpacity>
      <TouchableOpacity style={ border_icon }>
        <Font name={ 'whatsapp' } color={ 'white' } size={ 20 } onPress={() =>  _onChatWa({ phone: el.phone })}/>
      </TouchableOpacity>
    </View>
  </View>
)