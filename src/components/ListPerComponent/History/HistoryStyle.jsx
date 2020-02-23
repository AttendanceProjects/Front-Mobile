import { StyleSheet, Platform } from 'react-native';

export const HistoryStyle = StyleSheet.create({
  history_top_container: { flexDirection: 'row', alignItems: 'center', marginBottom: Platform.OS === 'android' ? 0 : 0 },
  history_body: { marginLeft: 10, marginBottom: 10 },
  container_bottom: {
    flex: 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#c7ecee',
    borderWidth: 1,
    borderRadius: 20,
    height: Platform.OS === 'adnroid' ? 65 : 70
  },
  font_medium: { fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 10 : 15 },
  font_small: { fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold', letterSpacing: 1 },
  font_clock: { fontWeight: 'bold', color: 'blue' },
  message_reason: { fontWeight: 'bold', fontSize: 18, color: '#7fcd91', marginTop: 10 },
  content_reason: { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: '100%' }
})