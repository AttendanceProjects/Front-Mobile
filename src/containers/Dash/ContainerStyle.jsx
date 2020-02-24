import { StyleSheet, Platform } from 'react-native';


export const ContainerStyle = StyleSheet.create({
  // profile

  profile_container: { flex: 1, padding: 15, alignItems: 'center', justifyContent: 'space-around' },
  profile_header: { flex: 0.2, width: '98%', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  profile_image: { height: 100, width: 100, borderRadius: 30 },
  profile_up_loading: { marginTop: 10, marginBottom: 5 },
  profile_button_upload: { marginBottom: 5, borderRadius: 10, marginTop: 10, backgroundColor: '#84142d', height: 30, width: 120, alignItems: 'center', justifyContent: 'center' },
  font_small: { fontSize: Platform.OS === 'android' ? 10 : 12, color: 'grey' },
  font_medium: { fontSize: Platform.OS === 'android' ? 10 : 15, color: 'black', fontWeight: 'bold' },
  profile_footer: { flex: 0.2, flexDirection: 'row', width: '98%', justifyContent: 'space-around', alignItems: 'center' },
  profile_button_change: { alignItems: 'center', backgroundColor: '#f0134d', height: 60, width: Platform.OS === 'android' ? 80 : 75, borderRadius: 20, justifyContent: 'center' },
  profile_table: { flex: 0.55, width: '98%', padding: 10, justifyContent: 'center' },
  profile_per_row: { borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' },
  profile_table_lable: { fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' },
  profile_table_span: { marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 },


  // Signin
  prepare_container: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  prepare_content: { height: '60%', justifyContent: 'flex-end' },
  prepare_logo: { height: 200, width: 200 },
  prepare_text_loading: { marginTop: 10, textAlign: 'center', fontWeight: "bold", letterSpacing: 2 },
  prepare_button_try: { height: 30, marginTop: 10, borderRadius: 10, shadowOpacity: 0.6, shadowRadius: 2, backgroundColor: '#C1C1C1', width: 100, alignItems: 'center', justifyContent: 'center' },
  prepare_welcome: { fontSize: Platform.OS === 'android' ? 14 : 17, fontWeight: 'bold', color: 'green', textAlign: 'center' },
  prepare_powered: { height: '40%', justifyContent: 'flex-end' },
  prepare_footer: { flexDirection: 'row', marginBottom: 10 },

  // Live Att
  live_time: { backgroundColor: '#90b8f8', height: 200, alignItems: 'center', justifyContent: 'center' },
  live_time_time: { fontSize: 50, fontWeight: 'bold', color: '#f44336' },
  live_time_date: { marginTop: 20, fontWeight: 'bold', fontSize: 20 },
  live_content: {
    height: Platform.OS === 'android' ? 500 : 420,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  live_content_body: { width: '99%', height: 160, borderWidth: 1, borderColor: '#f1f1f6' },
  live_content_header: { width: '100%', backgroundColor: '#f1f1f6', alignItems: 'center', height: 30, justifyContent: 'center' },
  live_main: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6'
  },
  font_check: { fontSize: 20 },
  live_font_small: { marginTop: 10, fontWeight: 'bold' },
  live_main_body: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  live_button_content: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  live_button:  {
    width: '35%',
    backgroundColor: '#192965',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 10
  },
  live_button_text: { color: 'white', fontWeight: 'bold' },
  live_offline_loading: { width: '100%', alignItems: 'center', marginTop: 20 },
  live_message_content: { width: '100%', marginTop: 15, height: 50, alignItems: 'center', justifyContent: 'center' },
  live_time_loading: { height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  live_reason: { height: 30, backgroundColor: '#f1f1f6', textAlign: 'center', borderRadius: 10, color: 'black', fontWeight: 'bold', width: '80%' },
  live_footer_content: { height: 180, width: '100%', position: 'absolute', bottom: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 10 },
  live_footer_main: { height: '50%', padding: 10, justifyContent: 'center', borderBottomColor: '#C1C1C1', borderBottomWidth: 1 },
  live_footer_text: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  live_schedule: { padding: 6, width: 250, borderRadius: 10, borderWidth: 1, borderColor: '#C1C1C1', height: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  live_footer_context: { height: '50%', width: '100%', padding: 5 },
  live_footer_context_main: { height: '30%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5, paddingRight: 5 },
  live_touchable_history: { height: '70%', width: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#C1C1C1', borderRadius: 10 },
  live_logged_content: { height: '35%', flexDirection: 'row', width: '100%', alignItems: 'center', paddingLeft: 10 },
  logged_text: { fontSize: Platform.OS === 'android' ? 15 : 18, paddingLeft: 20 },
  context_empty: { width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center' },

  
  //history;
  his_content: { flex: 1, backgroundColor: '#353941' },
  his_loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  his_body: { marginTop: 10, marginHorizontal: 5 },
  his_items: { position: "relative", width: '100%' },
  his_button_icon: { height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 2, backgroundColor: 'white', borderRadius: 20 },
  his_update_content: { position: 'absolute', top: 15, right: 50 },
  his_content_text: { fontSize: 10, color: 'white', fontWeight: 'bold' },
  his_empty: { flex: 1, marginTop: Platform.OS === 'android' ? 200 : 150, alignItems: 'center', justifyContent: 'center' },
  his_image_empty: { width: 150, height: 150 },
  his_text_empty: { fontSize: Platform.OS === 'android' ? 15 : 20, color: 'white', fontWeight: 'bold', marginTop: Platform.OS === 'android' ? 35 : 50, letterSpacing: 2 },

  // change pin
  pin_content: { flex: 1, backgroundColor: '#c1c1c1' },
  pin_header_content: { height: '13%', width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10, backgroundColor: '#f1f1f1' },
  pin_large: { fontSize: Platform.OS === 'android' ? 15 : 25, fontWeight: 'bold', letterSpacing: 1 },
  pin_small: { fontSize: Platform.OS === 'android' ? 8 : 10 },
  pin_body: { height: '87%', width: '100%', alignItems: 'center', paddingTop: 20 },
  pin_body_top: { height: '60%', width: '100%', padding: 15 },
  pin_loop_content: { width: '100%', flexDirection: 'row', justifyContent: 'center' },
  pin_text: { paddingRight: 20, color: 'white', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 15 : 20, width: '50%', textAlign: 'right' },
  pin_input: { paddingLeft: 10, color: 'white', fontWeight: 'bold', borderRadius: 20, shadowOpacity: 10, fontSize: 20, width: '50%' },
  pin_button_content: { height: 50, flexDirection: 'row', width: '100%', marginTop: 20 },
  pin_button_save: { width: '50%', alignItems: 'center', justifyContent: 'center' },
  pin_button_text: { width: '50%', height: '50%', backgroundColor: '#beebe9', alignItems: 'center', justifyContent: 'center', borderRadius: 20, shadowOpacity: 5 }
})