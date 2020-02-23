import { StyleSheet, Platform } from 'react-native';

export const ListStyle = StyleSheet.create({
  container_touchable: {
    height: 60,
    width: '100%',
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  content_touchable: {
    flex: 1,
    backgroundColor: '#90b8f8',
    borderRadius: 8,
  },
  body_correction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  date_correction: { width: '45%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  font_date: { fontWeight: 'bold', color: 'white', fontSize: 14 },
  main_detail_correction: { width: '55%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  font_small: { color: 'white', fontSize: Platform.OS === 'android' ? 10 : 12, letterSpacing: 2 },
  font_medium: { color: 'green', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 15 },
  content_loading_correction: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' }
})