import { StyleSheet, Platform } from 'react-native';

export const AdminStyle = StyleSheet.create({
  containers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  content:{
    width: '100%',
    height: 500,
    backgroundColor: '#f1fcfc',
    borderRadius: 20, padding: 10
  },
  before_content: {
    height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading_text: {
    marginTop: 10,
    fontSize: Platform.OS === 'android' ? 13 : 18,
    fontWeight: 'bold'
  },
  header_fade_view: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header_text: {
    fontSize: Platform.OS === 'android' ? 20 : 25,
    textAlign: 'center',
    margin: Platform.OS === 'android' ? 2 : 10
  },
  close_fade_x: {
    fontSize: Platform.OS === 'android' ? 30 : 35
  },
  body_content: {
    height: '70%',
    width: '100%',
    padding: 5,
    flexDirection: 'row'
  },
  content_detail: {
    width: '50%',
    height: '100%',
    padding: 5
  },
  detail_header: {
    height: '10%',
    width: '100%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detail_header_text: {
    fontSize: 10,
    color: 'grey'
  },
  detail_header_create: {
    fontSize: Platform.OS === 'android' ? 10 : 13,
    fontWeight: 'bold'
  },
  content_before: {
    width: '100%',
    height: '20%',
    padding: 5
  },
  before_text: {
    color: 'grey',
    fontSize: Platform.OS === 'android' ? 12 : 15
  },
  before_body: {
    paddingLeft: 5,
    paddingTop: 5
  },
  before_main: {
    width: '100%',
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  main_text: {
    fontSize: Platform.OS === 'android' ? 10 : 12,
    color: 'grey',
    width: '50%'
  },
  main_times: {
    fontWeight: 'bold',
    fontSize: Platform.OS === 'android' ? 12 : 15
  },
  content_after: {
    width: '100%',
    height: '20%',
    padding: 5
  },
  content_footer: {
    height: '50%',
    width: '100%',
    padding: 5
  },
  footer_text: {
    fontSize: Platform.OS === 'android' ? 10 : 13,
    color: 'grey',
    height: '13%'
  },
  footer_content: {
    height: '87%',
    width: '100%'
  },
  content_image:{
    height: '50%',
    width: '100%',
    alignItems: 'center'
  },
  image_footer: {
    height: '97%',
    width: '50%'
  },
  image_text: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold'
  },
  reason_footer: {
    height: '50%',
    width: '100%',
    alignItems: 'center',
    marginTop: 5
  },
  reason_text: {
    fontSize: Platform.OS === 'adnroid' ? 10 : 12,
    color: 'grey',
    marginTop: 2
  },
  right_content: {
    width: '50%',
    height: '100%',
    padding: 5
  },
  content_maps: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  invalid_maps: {
    fontWeight: 'bold',
    color: 'red'
  },
  body_att_reason: {
    height: '50%'
  },
  list_images: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    padding: 5
  },
  images_check: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  size_image: {
    width: '95%',
    height: '95%'
  },
  text_no_image: {
    fontWeight: 'bold',
    color: 'salmon',
    fontSize: Platform.OS === 'android' ? 13 : 18,
    textAlign: 'center'
  },
  footer_list_content: {
    width: '100%',
    padding: 5,
    height: '50%'
  },
  footer_reason_list: {
    width: '97%',
    alignItems: 'center',
    height: '40%',
    marginTop: 2
  },
  main_loading_touchable: {
    width: '100%',
    height: '20%',
    paddingBottom: 10,
    flexDirection: 'row'
  },
  loading_touchable: {
    width: '80%', height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowOpacity: 2,
    backgroundColor: '#fd5e53'
  },
  touchable_response: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowOpacity: 2
  },
  content_loading_touchable: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  admin_button: { marginTop: 10, height: 100, width: '97%', borderRadius: 10, padding: 10, backgroundColor: '#F1F1F1' },
  list_content_left: { height: '30%', flexDirection: 'row', width: '100%' },
  font_list_medium: { fontSize: Platform.OS === 'android' ? 10 : 14, color: 'black', fontWeight: 'bold' },
  font_list_small: { fontSize: Platform.OS === 'android' ? 8 : 12, color: 'grey' },
  content_admin: { width: '50%', height: '100%', alignItems: 'center' },
  user_info_content: { width: '55%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  att_info_user: { width: '45%', height: '100%', alignItems: 'center', marginTop: 10 },
  att_check_info: { width: '100%', flexDirection: 'row', alignItems: 'center', height: '80%', justifyContent: 'space-between' },
  list_data_content: { flexDirection: 'row', width: '100%', height: 13 },
  item_body_message: { width: '30%', height: 15 },
  main_items_admin: { width: '70%', height: 15 }
})