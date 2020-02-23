import { StyleSheet, Platform } from 'react-native';

export const EmployeeStyle = StyleSheet.create({
  container_employee: { height: 100, width: '100%', flexDirection: 'row' },
  content_image: { width: '20%', justifyContent: 'center', alignItems: 'center' },
  image_profile: { width: 50, height: 50, borderRadius: 40 },
  main_content: { width: '40%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' },
  text_name: { fontSize: Platform.OS === 'android' ? 14 : 17, fontWeight: 'bold', letterSpacing: 1 },
  text_me: { color: 'green', fontWeight: 'bold', fontSize: 10, textAlign: 'right' },
  font_small: { color: 'grey', fontSize: 13 },
  info_content: { width: '40%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' },
  border_icon: {
    width: Platform.OS === 'android' ? 41 : 40, height: Platform.OS === 'android' ? 41 : 40, borderRadius: 20, borderWidth: 1, borderColor: 'grey', justifyContent: 'center', alignItems: 'center'
  }
})