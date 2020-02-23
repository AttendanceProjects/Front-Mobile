import { StyleSheet, Platform } from 'react-native';

export const DashStyle = StyleSheet.create({
  touchable_container_permission: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8
  },
  font_content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  content_detail: { marginLeft: 15 },
  text_submit: { color: 'grey', fontSize: Platform.OS === 'android' ? 7 : 10 },
  text_name_submit: { fontSize: Platform.OS === 'adnroid' ? 10 : 13 }
})