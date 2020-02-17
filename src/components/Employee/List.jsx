import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const ListEmployeeComponent = ({ el, _onSendEmail, _onChatWa, i, username, _onCalling }) => (
  <View style={{ height: 100, width: '100%', flexDirection: 'row', marginTop: i !== 0 ? 10 : 0 }}>
    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={ el.profile_image ? { uri: el.profile_image } : require('../../../assets/defaultImage.png' ) } style={{ width: 50, height: 50, borderRadius: 40 }} />
    </View>
    <View style={{ width: '40%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 14 : 17, fontWeight: 'bold', letterSpacing: 1 }}>
        { el.username ? el.username.toUpperCase() : ' - ' }
        { username && el.username === username
            ? <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 10, textAlign: 'right' }}>
                Me
              </Text>
            : null }
      </Text>
      <Text style={{ marginTop: 10 }}>{ el.role ? el.role : ' - ' } &nbsp; <Text style={{ color: 'grey', fontSize: 13 }}>{ el.gender ? el.gender : ' - ' }</Text></Text>
    </View>
    <View style={{ width: '40%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
      <TouchableOpacity style={ styles.borderIcon } onPress={() => _onCalling({ phone: el.phone })}>
        <Font name={ 'phone' } color={ 'white' } size={ 20 }/>
      </TouchableOpacity>
      <TouchableOpacity style={ styles.borderIcon } onPress={() => _onSendEmail({ to: el.email && el.email })}>
        <Font name={ 'envelope' } color={ 'white' } size={ 20 } />
      </TouchableOpacity>
      <TouchableOpacity style={ styles.borderIcon }>
        <Font name={ 'whatsapp' } color={ 'white' } size={ 20 } onPress={() =>  _onChatWa({ phone: el.phone })}/>
      </TouchableOpacity>
    </View>
  </View>
)


const styles = StyleSheet.create({
  borderIcon: {
    width: Platform.OS === 'android' ? 41 : 40, height: Platform.OS === 'android' ? 41 : 40, borderRadius: 20, borderWidth: 1, borderColor: 'grey', justifyContent: 'center', alignItems: 'center'
  }
})