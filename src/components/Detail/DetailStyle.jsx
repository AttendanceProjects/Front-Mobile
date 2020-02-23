import { StyleSheet, Platform } from 'react-native';

export const DetailStyle = StyleSheet.create({
  content_header: { flex: 0.5, alignItems: 'center', flexDirection: 'row', padding: 10 },
  image_header: { width: 60, height: 60, borderRadius: 10 },
  font_small: { fontSize: Platform.OS === 'android' ? 10: 15, marginLeft: 10, color: 'white', fontWeight: 'bold' },
  content_header_right: { flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', padding: 10 },
  font_clock: { fontSize: Platform.OS === 'android' ? 20 : 25, marginLeft: 10, fontWeight: 'bold' },
  container_maps: { height: '100%', width: '100%', marginLeft: 20, alignItems: 'flex-end' },
  map_content: { height: '100%', width: '100%' },
  image_maps: { width: 15, height: 30 },

  map_detail: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  map_style_detail: { width: '100%', height: Platform.OS === 'android' ? 410 : 350, borderRadius: 20 }
})